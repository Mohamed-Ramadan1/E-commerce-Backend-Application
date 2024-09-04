import Order from "../models/orderModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { NextFunction, Response } from "express";
import { IOrder } from "../models/order.interface";

import { RefundRequestReq } from "../shared-interfaces/refundRequestReq.interface";
import { IUser } from "../models/user.interface";
import User from "../models/userModel";
import { IRefundRequest, RefundStatus } from "../models/refund.interface";

import RefundRequest from "../models/refundModel";

export const validateRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const refundRequest: IRefundRequest | null = await RefundRequest.findById(
      req.params.id
    );
    if (!refundRequest) {
      return next(new AppError("No refund request found with this id", 404));
    }
    if (refundRequest.refundStatus !== RefundStatus.Pending) {
      return next(
        new AppError(
          `This refund request is already processed and its state is ${refundRequest.refundStatus}`,
          400
        )
      );
    }

    const user: IUser | null = await User.findById(refundRequest.user);
    const order: IOrder | null = await Order.findById(refundRequest.order);
    if (!user) {
      return next(
        new AppError(
          "something went wrong the user account related to this refund operation no longer exist ",
          404
        )
      );
    }
    if (!order) {
      return next(
        new AppError(
          "something went wrong the order related to this refund operation no longer exist ",
          404
        )
      );
    }
    req.order = order;
    req.userToRefund = user;
    req.refundRequest = refundRequest;

    next();
  }
);
