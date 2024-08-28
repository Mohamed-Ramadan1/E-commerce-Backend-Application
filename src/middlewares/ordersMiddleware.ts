// system imports
import { NextFunction, Response } from "express";
// models imports
import Order from "../models/orderModel";
import User from "../models/userModel";

// interface imports
import { IOrder, OrderStatus } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { OrderRequest } from "../shared-interfaces/orderRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

export const validateBeforeCancelOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    console.log("req.params.id", req.params.id);
    const order: IOrder | null = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.orderStatus !== OrderStatus.Processing) {
      return next(new AppError("Only processing orders can be cancelled", 400));
    }
    const user = (await User.findById(order.user)) as IUser;
    req.order = order;
    req.userOrderOwner = user;

    next();
  }
);
