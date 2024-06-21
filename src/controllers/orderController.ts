import Order from "../models/orderModel";
import Product from "../models/productModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { NextFunction, Request, Response } from "express";
import { IOrder } from "../models/order.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import {
  AuthUserRequest,
  AuthUserRequestWithID,
} from "../shared-interfaces/request.interface";

export const getOrders = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const orders: IOrder[] | null = await Order.find({
      user: req.user._id,
    });
    const response: ApiResponse<IOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);

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

export const cancelOrder = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const order: IOrder | null = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        orderStatus: "cancelled",
      },
      {
        new: true,
        runValidators: true,
      }
    );
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

/*
1) cancel the order
2) update the shipping order status 
3) archive order 
4) 
5)
6)
*/

// admin controllers.

// export const getOrder = catchAsync(
//     async (req: Request, res: Response, next: NextFunction) => {}
//   );
