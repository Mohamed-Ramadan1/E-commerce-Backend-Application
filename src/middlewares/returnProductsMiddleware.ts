import ReturnProduct from "../models/returnProductsModel";
import Order from "../models/orderModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { IReturnRequest } from "../models/returnProducts.interface";
import { IOrder } from "../models/order.interface";
import { NextFunction, Response } from "express";
import { ReturnItemsRequest } from "../shared-interfaces/request.interface";

export const validateBeforeReturnRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { orderId, productId, quantity, returnReason } = req.body;

    if (!orderId || !productId || !quantity || !returnReason) {
      return next(
        new AppError("Order ID, Product ID, and quantity are required", 400)
      );
    }
    const order: IOrder | null = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return next(new AppError("No order found with this ID", 404));
    }
    if (order.orderStatus !== "delivered") {
      return next(
        new AppError("You can't return items from an un-delivered order", 400)
      );
    }

    const orderItem = order.items.find(
      (item: any) => item.product._id.toString() === productId.toString()
    );
    if (!orderItem) {
      return next(new AppError("This product not found on the order.", 404));
    }

    if (quantity > orderItem.quantity) {
      return next(
        new AppError("You can't return more than you purchased", 400)
      );
    }
    if (quantity < 1) {
      return next(new AppError("You can't return less than 1 item", 400));
    }
    const existingReturn: IReturnRequest | null = await ReturnProduct.findOne({
      order: orderId,
      "product._id": productId,
    });
    if (existingReturn) {
      return next(new AppError("This product has already been returned", 400));
    }

    const thirtyDaysAgo: Date = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (new Date(order.createdAt) < thirtyDaysAgo) {
      return next(
        new AppError(
          "You can only return products purchased within the last 30 days",
          400
        )
      );
    }

    req.returnedProduct = orderItem;
    next();
  }
);
