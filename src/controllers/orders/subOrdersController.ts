// system imports
import { NextFunction, Response } from "express";

import SubOrder from "../../models/subOrders/subOrderModal";

// interface imports
import { ISubOrder } from "../../models/subOrders/subOrder.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { SubOrderRequest } from "../../shared-interfaces/subOrderRequest.interface";
// utils imports
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/ApplicationError";
import APIFeatures from "../../utils/apiKeyFeature";
import { sendResponse } from "../../utils/sendResponse";

//emails imports
//-----------------------------------
// get all shops order
export const getAllOrders = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(SubOrder.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders: ISubOrder[] = await features.execute();
    const response: ApiResponse<ISubOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);

// get shop order with only order id
export const getOrder = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order: ISubOrder | null = await SubOrder.findById(orderId);
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<ISubOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// delete order
export const deleteOrder = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order: ISubOrder | null = await SubOrder.findByIdAndDelete(orderId);
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<ISubOrder> = {
      status: "success",
      message: "Order deleted successfully.",
    };
    sendResponse(204, response, res);
  }
);

//-------------------------------
// Shop owner controller

// get all orders on the shop
export const getSubOrders = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      SubOrder.find({
        shop: req.shopId,
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders: ISubOrder[] = await features.execute();
    const response: ApiResponse<ISubOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };

    sendResponse(200, response, res);
  }
);

// get single order on shop
export const getSubOrder = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    const order: ISubOrder | null = await SubOrder.findOne({
      shop: req.shopId,
      _id: req.params.orderId,
    });
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<ISubOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// delete order on the shop

export const deleteSubOrder = catchAsync(
  async (req: SubOrderRequest, res: Response, next: NextFunction) => {
    // find and delete the order based on the order id rom the params and shopId on the req object.
    const order: ISubOrder | null = await SubOrder.findOneAndDelete({
      shop: req.shopId,
      _id: req.params.orderId,
    });

    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    // create response object
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };

    // send response
    sendResponse(204, response, res);
  }
);
