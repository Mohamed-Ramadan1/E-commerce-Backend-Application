import Order from "../models/orderModel";
import RefundRequest from "../models/refundModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { NextFunction, Response } from "express";
import { IOrder } from "../models/order.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import {
  AuthUserRequest,
  AuthUserRequestWithID,
} from "../shared-interfaces/request.interface";
import { IUser } from "../models/user.interface";
import User from "../models/userModel";
import confirmOrderShippedSuccessfully from "../utils/emails/shippingOrderEmail";
import confirmOrderDelivered from "../utils/emails/deliverOrderEmail";
import confirmOrderCancellation from "../utils/emails/adminOrderCancellationOrdreConfirmation";
import refundRequestCreatedEmail from "../utils/emails/refundRequestConfirmationEmail";

/*
get all orders 
get order
update order status
update shipping status


 TODO: Get orders status


*/

//get All Orders
export const getOrders = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const orders: IOrder[] = await Order.find();
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
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
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

//cancel the order
export const cancelOrder = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
    });

    if (!order) {
      return next(new AppError("No order found with this id", 404));
    }
    if (order.orderStatus === "cancelled") {
      return next(new AppError("Order is already cancelled", 400));
    }

    order.orderStatus = "cancelled";
    await order.save();
    const user = (await User.findById(order.user)) as IUser;

    // check if the user payment with the credit card and if it create the refund request and send email with the refund data
    if (
      order.paymentMethod === "credit_card" &&
      order.paymentStatus === "paid"
    ) {
      const refundRequest = await RefundRequest.create({
        user: user._id,
        order: order._id,
        refundAmount: order.totalPrice.toFixed(2),
        refundMethod: "giftCard",
        refundType: "cancellation",
      });
      //send the email by the data of refund
      refundRequestCreatedEmail(user, refundRequest);
    }
    // send cancellation confirmation email
    confirmOrderCancellation(user, order);
    const response: ApiResponse<IOrder> = {
      status: "success",
      message: "Order cancelled successfully",
    };
    sendResponse(200, response, res);
  }
);

//Update Order Status to shipped
export const updateOrderStatusToShipped = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
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
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
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
