// system imports
import { NextFunction, Response } from "express";
import mongoose, { mongo } from "mongoose";
// models imports
import Order from "../models/orderModel";
import RefundRequest from "../models/refundModel";
import User from "../models/userModel";

// interface imports
import { IOrder, OrderStatus } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { OrderRequest } from "../shared-interfaces/orderRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";
import { createRefundRequest } from "../utils/orderUtils/createOrderRefundRequest";
import { updateSubOrdersState } from "../utils/orderUtils/updateSubOrderStatus";

// emails imports
import confirmOrderShippedSuccessfully from "../emails/admins/shippingOrderEmail";
import confirmOrderDelivered from "../emails/admins/deliverOrderEmail";
import confirmOrderCancellation from "../emails/admins/adminOrderCancellationOrdreConfirmation";
import refundRequestCreatedEmail from "../emails/users/refundRequestConfirmationEmail";
import { IRefundRequest } from "../models/refund.interface";

//get All Orders
export const getOrders = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const apiFeatures = new APIFeatures(Order.find(), req.query);

    const orders: IOrder[] = await apiFeatures.execute();

    const response: ApiResponse<IOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);
//Get the order
export const getOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order: IOrder | null = await Order.findById(id);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// TODO Link the main order with the suborders

//cancel the order
export const cancelOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { order, userOrderOwner } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      order.orderStatus = OrderStatus.Cancelled;
      await order.save({ session });

      await updateSubOrdersState(order, session, OrderStatus.Cancelled);

      if (
        order.paymentMethod === "credit_card" &&
        order.paymentStatus === "paid"
      ) {
        await createRefundRequest(userOrderOwner, session, order);
      }

      confirmOrderCancellation(userOrderOwner, order);

      await session.commitTransaction();

      const response: ApiResponse<IOrder> = {
        status: "success",
        message: "Order cancelled successfully",
      };
      sendResponse(200, response, res);
    } finally {
      session.endSession();
    }
  }
);

//Update Order Status to shipped
export const updateOrderStatusToShipped = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order: IOrder | null = await Order.findByIdAndUpdate(
      id,
      {
        shippingStatus: "shipped",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const user = (await User.findById(order.user)) as IUser;

    // send shipping confirmation email
    confirmOrderShippedSuccessfully(user, order);

    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

//Update Order Status to delivered
export const updateOrderStatusToDelivered = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order: IOrder | null = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: "delivered",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const user = (await User.findById(order.user)) as IUser;
    // send delivery confirmation email
    confirmOrderDelivered(user, order);
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);
