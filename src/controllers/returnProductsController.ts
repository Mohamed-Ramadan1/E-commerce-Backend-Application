import ReturnProduct from "../models/returnProductsModel";
import Order from "../models/orderModel";
import RefundRequest from "../models/refundModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { IReturnRequest } from "../models/returnProducts.interface";
import { IRefundRequest } from "../models/refund.interface";
import { IOrder } from "../models/order.interface";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import {
  AuthUserRequest,
  ReturnItemsRequest,
} from "../shared-interfaces/request.interface";
import { IUser } from "../models/user.interface";
import User from "../models/userModel";
import refundRequestForReturnedItemsEmail from "../utils/emails/refundRequestForReturnedItemsEmail";

// ----------------------------------------------------------------
//Users Operations
export const requestReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // orderId   ProductId  quantity   reason
    /*
    get the order from the order model and check if the order belongs to the user
    get the product from the product model and check if the product exists
    check if the product is in the order
    check if the product is not already returned
    check the product is purchased within the last 30 days
    create a return request
    */
    const { orderId, quantity, returnReason } = req.body;
    const returnedItem: any = req.returnedProduct;
    const refundAmount: number = returnedItem.product.price * quantity;
    const user: IUser = req.user;
    const returnProductRequest: IReturnRequest | null =
      await ReturnProduct.create({
        user: user._id,
        order: orderId,
        product: returnedItem.product,
        quantity: quantity,
        returnReason: returnReason,
        refundAmount: refundAmount,
      });
    if (!returnProductRequest) {
      return next(new AppError("Something went wrong", 400));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnProductRequest,
    };
    sendResponse(201, response, res);
  }
);

export const cancelReturnRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndUpdate(
        id,
        {
          returnStatus: "Cancelled",
        },
        {
          new: true,
          runValidators: true,
        }
      );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);
export const getAllMyReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const user: IUser = req.user;
    const returnRequests: IReturnRequest[] = await ReturnProduct.find({
      user: user._id,
    });
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getMyReturnRequestItem = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null = await ReturnProduct.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

export const deleteReturnItemRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndDelete({
        _id: id,
        user: req.user._id,
      });
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

// ----------------------------------------------------------------

//admin Operations
export const getAllReturnItemsRequests = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const returnRequests: IReturnRequest[] = await ReturnProduct.find();
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getReturnItemRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null = await ReturnProduct.findById(
      id
    );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

export const approveReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndUpdate(
        id,
        {
          receivedItemsStatus: "Received",
          returnStatus: "Approved",
        },
        {
          new: true,
          runValidators: true,
        }
      );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }

    // create the refund request and send confirmation email to the user
    // get the order and the user
    const user = (await User.findById(returnRequest.user)) as IUser;
    const order = (await Order.findById(returnRequest.order)) as IOrder;
    const refundRequest: IRefundRequest = await RefundRequest.create({
      order: order._id,
      user: user._id,
      refundAmount: returnRequest.refundAmount,
      refundMethod: "giftCard",
      refundType: "return",
      refundStatus: "pending",
    });
    // send email to the user to tell him items received and refund mony request created
    refundRequestForReturnedItemsEmail(user, refundRequest, returnRequest);

    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

export const rejectReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndUpdate(
        id,
        {
          returnStatus: "Rejected",
        },
        {
          new: true,
          runValidators: true,
        }
      );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);
