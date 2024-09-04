import ReturnProduct from "../models/returnProductsModel";
import User from "../models/userModel";
import Order from "../models/orderModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import {
  IReturnRequest,
  ReturnStatus,
} from "../models/returnProducts.interface";
import { IOrder, OrderStatus } from "../models/order.interface";
import { NextFunction, Response } from "express";
import { ReturnItemsRequest } from "../shared-interfaces/returnItemRequestReq.interface";
import { ICartItem } from "../models/cartItem.interface";
import { IUser } from "../models/user.interface";
import { ObjectId } from "mongoose";

const validateReturnFields = (body: ReturnItemsRequest["body"]) => {
  const { orderId, productId, quantity, returnReason } = body;
  if (!orderId || !productId || !quantity || !returnReason) {
    throw new AppError(
      "Order ID, Product ID, quantity, and return reason are required",
      400
    );
  }
  if (quantity < 1) {
    throw new AppError("You can't return less than 1 item", 400);
  }
};

const validateOrder = async (
  orderId: ObjectId,
  userId: ObjectId
): Promise<IOrder> => {
  const order: IOrder | null = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new AppError("No order found with this ID", 404);
  }

  if (order.orderStatus !== OrderStatus.Delivered) {
    throw new AppError(
      "You can't return items from an un-delivered order.",
      400
    );
  }
  return order;
};

const validateOrderItem = (
  order: IOrder,
  productId: ObjectId,
  quantity: number
): ICartItem => {
  const orderItem = order.items.find(
    (item: ICartItem) => item.product._id.toString() === productId.toString()
  );
  if (!orderItem) {
    throw new AppError("This product not found on the order.", 404);
  }
  if (quantity > orderItem.quantity) {
    throw new AppError("You can't return more than you purchased", 400);
  }
  return orderItem;
};

const validateExistingReturn = async (
  orderId: ObjectId,
  productId: ObjectId
) => {
  const existingReturn: IReturnRequest | null = await ReturnProduct.findOne({
    order: orderId,
    "product._id": productId,
  });

  if (existingReturn) {
    switch (existingReturn.returnStatus) {
      case ReturnStatus.Pending:
        throw new AppError(
          "You already have a pending return request for this product.",
          400
        );
      case ReturnStatus.Approved:
        throw new AppError("This product has already been returned.", 400);
      case ReturnStatus.Rejected:
        throw new AppError(
          "Your return request for this product was rejected. Please contact support.",
          400
        );
    }
  }
};

const validateReturnWindow = (orderDate: Date) => {
  const thirtyDaysAgo: Date = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  if (orderDate < thirtyDaysAgo) {
    throw new AppError(
      "You can only return products purchased within the last 30 days",
      400
    );
  }
};

export const validateBeforeReturnRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { orderId, productId, quantity, returnReason } = req.body;

    validateReturnFields(req.body);

    const order: IOrder | undefined = await validateOrder(
      orderId,
      req.user._id
    );

    const orderItem: ICartItem = validateOrderItem(order, productId, quantity);

    await validateExistingReturn(orderId, productId);

    validateReturnWindow(order.createdAt);

    req.returnedProduct = orderItem;
    next();
  }
);

export const validateBeforeProcessReturnRequests = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // get return request
    const { id } = req.params;

    const returnRequest: IReturnRequest | null = await ReturnProduct.findById(
      id
    );

    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }

    if (returnRequest.returnStatus !== ReturnStatus.Pending) {
      return next(
        new AppError(
          "You can't approve this request only pending return requests can be approved.",
          400
        )
      );
    }
    // get user return request related
    const user: IUser | null = await User.findById(returnRequest.user);
    if (!user) {
      return next(
        new AppError(
          "User who created this return request no longer exits.",
          404
        )
      );
    }
    const order: IOrder | null = await Order.findById(returnRequest.order);
    if (!order) {
      return next(new AppError("Order no longer exists.", 404));
    }

    req.order = order;
    req.userToReturn = user;
    req.returnRequest = returnRequest;
    next();
  }
);
