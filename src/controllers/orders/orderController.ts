// system imports
import { NextFunction, Response } from "express";
import mongoose from "mongoose";

import Order from "../../models/order/orderModel";

// interface imports
import { IOrder, OrderStatus } from "../../models/order/order.interface";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";

import { OrderRequest } from "../../requestsInterfaces/orders/orderRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { createRefundRequest } from "../../utils/orderUtils/createOrderRefundRequest";
import { updateSubOrdersState } from "../../utils/orderUtils/updateSubOrderStatus";
//emails imports
import confirmOrderCancelled from "../../emails/users/cancelOrderVerificationEmail";

// get all user orders
export const getOrders = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Order.find({ user: req.user._id, archived: false }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const orders: IOrder[] | null = await features.execute();

    const response: ApiResponse<IOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);
// get single user order
export const getOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
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
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { order, userOrderOwner } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (userOrderOwner._id.toString() !== req.user._id.toString()) {
        return next(
          new AppError("You are not authorized to cancel this order", 403)
        );
      }
      order.orderStatus = OrderStatus.Cancelled;
      await order.save({ session });

      await updateSubOrdersState(order, session, OrderStatus.Cancelled);

      // check if the order is paid with credit card and the payment is completed, then create a refund request.
      if (
        order.paymentMethod === "credit_card" &&
        order.paymentStatus === "paid"
      ) {
        await createRefundRequest(userOrderOwner, session, order);
      }

      // check if the user use his gitCard balance to pay any part of the order price amount and return it back to his account.
      if (order.paidAmountWithUserGiftCard !== 0) {
        userOrderOwner.giftCard += order.paidAmountWithUserGiftCard;
        await userOrderOwner.save({ validateBeforeSave: false, session });
      }

      confirmOrderCancelled(userOrderOwner, order);

      await session.commitTransaction();

      const response: ApiResponse<IOrder> = {
        status: "success",
        message: "Order cancelled successfully",
      };
      sendResponse(200, response, res);
    } catch (error) {
      console.error("Error cancelling order:", error);
      await session.abortTransaction();
      throw new AppError("Error cancelling order", 500);
    } finally {
      session.endSession();
    }
  }
);

// archive order
export const archiveOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    if (order.archived === true) {
      return next(new AppError("Order is already archived", 400));
    }
    order.archived = true;
    await order.save();
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// unarchive order
export const unarchiveOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    if (order.archived === false) {
      return next(new AppError("Order is already un-archived", 400));
    }
    order.archived = false;
    await order.save();
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// get all archived orders
export const getArchivedOrders = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Order.find({ user: req.user._id, archived: true }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders: IOrder[] | null = await features.execute();

    const response: ApiResponse<IOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);
