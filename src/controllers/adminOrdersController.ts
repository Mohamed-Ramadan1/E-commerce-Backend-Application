import Order from "../models/orderModel";
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

/*
get all orders 
get order
update order status
update shipping status
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

    const order = await Order.findById(id);
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

//Update Order Status to shipped
export const updateOrderStatusToShipped = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
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

    const order = await Order.findByIdAndUpdate(
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
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);
