// system imports
import { NextFunction, Response } from "express";

import ShopOrder from "../models/shopOrderModal";

// interface imports
import { IShopOrder } from "../models/shopOrder.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ShopOrderRequest } from "../shared-interfaces/shopOrderRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

//emails imports
//-----------------------------------
// get all shops order
export const getAllOrders = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    const orders: IShopOrder[] = await ShopOrder.find();
    const response: ApiResponse<IShopOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);

// get shop order with only order id
export const getOrder = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order: IShopOrder | null = await ShopOrder.findById(orderId);
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<IShopOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// delete order
export const deleteOrder = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order: IShopOrder | null = await ShopOrder.findByIdAndDelete(orderId);
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<IShopOrder> = {
      status: "success",
      message: "Order deleted successfully.",
    };
    sendResponse(204, response, res);
  }
);

//-------------------------------
// Shop owner controller

// get all orders on the shop
export const getShopOrders = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    const orders: IShopOrder[] = await ShopOrder.find({
      shop: req.shopId,
    });

    const response: ApiResponse<IShopOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };

    sendResponse(200, response, res);
  }
);

// get single order on shop
export const getShopOrder = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    const order: IShopOrder | null = await ShopOrder.findOne({
      shop: req.shopId,
      _id: req.params.orderId,
    });
    if (!order) {
      return next(new AppError("No order found with this id.", 404));
    }
    const response: ApiResponse<IShopOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

// delete order on the shop

export const deleteShopOrder = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    // find and delete the order based on the order id rom the params and shopId on the req object.
    const order: IShopOrder | null = await ShopOrder.findOneAndDelete({
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
