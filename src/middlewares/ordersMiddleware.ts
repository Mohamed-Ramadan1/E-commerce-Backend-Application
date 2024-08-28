// system imports
import { NextFunction, Response } from "express";
// models imports
import Order from "../models/orderModel";
import User from "../models/userModel";

// interface imports
import { IOrder, OrderStatus, ShippingStatus } from "../models/order.interface";
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

export const validateBeforeUpdateShippingStatus = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("Order not found", 404));
    }

    if (order.shippingStatus === ShippingStatus.Shipped) {
      return next(new AppError("Order has already been Shipped", 400));
    }
    const user: IUser | null = await User.findById(order.user);

    if (!user) {
      return next(
        new AppError("The user that make this order no longer exits.", 403)
      );
    }
    req.order = order;
    req.userOrderOwner = user;

    next();
  }
);

export const validateBeforeDeliverOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }

    if (order.orderStatus !== OrderStatus.Processing) {
      return next(new AppError("Only processing orders can be delivered", 400));
    }
    const user: IUser | null = await User.findById(order.user);

    if (!user) {
      return next(
        new AppError("The user that make this order no longer exits.", 403)
      );
    }
    req.order = order;
    req.userOrderOwner = user;
    // req.shop = shop;

    next();
  }
);
