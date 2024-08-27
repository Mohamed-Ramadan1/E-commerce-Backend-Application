// system imports
import { NextFunction, Response } from "express";
import mongoose from "mongoose";

import Order from "../models/orderModel";
import User from "../models/userModel";
import RefundRequest from "../models/refundModel";

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

//emails imports
import confirmOrderCancelled from "../emails/users/cancelOrderVerificationEmail";
import refundRequestCreatedEmail from "../emails/users/refundRequestConfirmationEmail";
import ShopOrder from "../models/shopOrderModal";

// TODO: send emails to notify the sub orders with updates / like cancellation / delivery and return items
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order: IOrder | null = await Order.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!order) {
        throw new AppError("No order found with this id.", 404);
      }

      if (order.orderStatus === "cancelled") {
        throw new AppError("Order is already cancelled", 400);
      }

      if (order.orderStatus === "delivered") {
        throw new AppError(
          "Order is already delivered, you can't cancel delivered orders.",
          400
        );
      }

      order.orderStatus = OrderStatus.Cancelled;
      await order.save({ session });

      const updateSubOrders = await ShopOrder.updateMany(
        { mainOrder: order._id },
        { $set: { orderStatus: OrderStatus.Cancelled } },
        { session }
      );

      if (!updateSubOrders.acknowledged) {
        throw new AppError("Error updating sub-orders while cancelling", 500);
      }

      const user = (await User.findById(order.user)) as IUser;

      if (
        order.paymentMethod === "credit_card" &&
        order.paymentStatus === "paid"
      ) {
        const refundRequest = new RefundRequest({
          user: user._id,
          order: order._id,
          refundAmount: order.totalPrice.toFixed(2),
          refundMethod: "giftCard",
          refundType: "cancellation",
        });

        const savedRequest = await refundRequest.save({ session });
        if (!savedRequest) {
          throw new AppError("Error saving refund request", 500);
        }

        refundRequestCreatedEmail(user, savedRequest);
      }

      confirmOrderCancelled(user, order);

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

//-------------------------------------------------------------

// Testing aggreigation pipeline in

// export const returnAnalytics = catchAsync(
//   async (req: AuthUserRequest, res: Response, next: NextFunction) => {
//     const orders = await Orders.aggregate([]);
//   }
// );
