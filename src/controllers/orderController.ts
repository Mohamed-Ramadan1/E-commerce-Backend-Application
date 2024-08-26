// system imports
import { NextFunction, Response } from "express";

import Order from "../models/orderModel";
import User from "../models/userModel";
import RefundRequest from "../models/refundModel";

// interface imports
import { IOrder, OrderStatus } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import {
  AuthUserRequest,
  AuthUserRequestWithID,
} from "../shared-interfaces/request.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";

//emails imports
import confirmOrderCancelled from "../emails/users/cancelOrderVerificationEmail";
import refundRequestCreatedEmail from "../emails/users/refundRequestConfirmationEmail";

// get all user orders
export const getOrders = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
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
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    if (order.orderStatus === "cancelled") {
      return next(new AppError("Order is already cancelled", 400));
    }
    if (order.orderStatus === "delivered") {
      return next(
        new AppError(
          "Order is already delivered, you can't cancel delivered orders.",
          400
        )
      );
    }

    order.orderStatus = OrderStatus.Cancelled;
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
    confirmOrderCancelled(user, order);
    const response: ApiResponse<IOrder> = {
      status: "success",
      message: "Order cancelled successfully",
    };
    sendResponse(200, response, res);
  }
);

// archive order
export const archiveOrder = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
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
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    if (order.archived === false) {
      return next(new AppError("Order is already unarchived", 400));
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
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
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

//-------------------------------------------------------------

// Testing aggreigation pipeline in

// export const returnAnalytics = catchAsync(
//   async (req: AuthUserRequest, res: Response, next: NextFunction) => {
//     const orders = await Orders.aggregate([]);
//   }
// );
