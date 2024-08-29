import { NextFunction, Response } from "express";

// models imports
import ReturnProduct from "../models/returnProductsModel";
import RefundRequest from "../models/refundModel";

// interface imports
import {
  IReturnRequest,
  ReturnStatus,
  ReceivedItemsStatus,
} from "../models/returnProducts.interface";
import { IRefundRequest } from "../models/refund.interface";
import { IOrder } from "../models/order.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ReturnItemsRequest } from "../shared-interfaces/returnItemRequestReq.interface";
import { IUser } from "../models/user.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";

//emails imports
import refundRequestForReturnedItemsEmail from "../emails/users/refundRequestForReturnedItemsEmail";
import { ICartItem } from "../models/cartItem.interface";
import mongoose from "mongoose";

// ----------------------------------------------------------------
//Users Operations

// create return product request
export const requestReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // orderId   ProductId  quantity   reason

    const { orderId, quantity, returnReason } = req.body;
    const user: IUser = req.user;

    const returnedItem: ICartItem = req.returnedProduct;

    const returnProductRequest: IReturnRequest | null =
      await ReturnProduct.create({
        user: user._id,
        order: orderId,
        product: returnedItem.product,
        quantity: quantity,
        returnReason: returnReason,
        refundAmount: returnedItem.priceAfterDiscount,
      });

    if (!returnProductRequest) {
      return next(new AppError("Something went wrong please tray agin.", 400));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnProductRequest,
    };
    sendResponse(201, response, res);
  }
);

// cancel the request
export const cancelReturnRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndUpdate(
        id,
        {
          returnStatus: ReturnStatus.Cancelled,
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

// get all user return items  requests
export const getAllMyReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      ReturnProduct.find({
        user: req.user._id,
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const returnRequests: IReturnRequest[] = await features.execute();
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

// get single return item request for the user
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

// delete return item request
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

// get all return items requests
export const getAllReturnItemsRequests = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ReturnProduct.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const returnRequests: IReturnRequest[] = await features.execute();
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

// get single return item request by id
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

// approve item return request
export const approveReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { order, userToReturn, returnRequest } = req;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // update refund request
      returnRequest.returnStatus = ReturnStatus.Approved;
      returnRequest.receivedItemsStatus = ReceivedItemsStatus.Received;
      returnRequest.processedBy = req.user._id;
      returnRequest.processedDate = new Date();
      await returnRequest.save({ session });

      const refundRequest: IRefundRequest = new RefundRequest({
        order: order._id,
        user: userToReturn._id,
        refundAmount: returnRequest.refundAmount,
        refundMethod: "giftCard",
        refundType: "return",
        refundStatus: "pending",
      });

      await refundRequest.save({ session });

      // Send email outside of transaction to prevent delays
      setImmediate(() => {
        refundRequestForReturnedItemsEmail(
          userToReturn,
          refundRequest,
          returnRequest
        );
      });

      // commit the transaction
      await session.commitTransaction();

      const response: ApiResponse<IReturnRequest> = {
        status: "success",
        data: returnRequest,
      };
      sendResponse(200, response, res);
    } catch (err: any) {
      await session.abortTransaction();
      throw new AppError(
        err.message || "Something went wrong please try again.",
        400
      );
    } finally {
      await session.endSession();
    }
  }
);

// reject item return request
export const rejectReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { order, userToReturn, returnRequest } = req;
    // update refund request
    returnRequest.returnStatus = ReturnStatus.Rejected;
    returnRequest.receivedItemsStatus = ReceivedItemsStatus.Received;
    returnRequest.processedBy = req.user._id;
    returnRequest.processedDate = new Date();
    const savedDocument = await returnRequest.save();
    if (!savedDocument) {
      return next(
        new AppError("Something went wrong while updating return request.", 400)
      );
    }
    // email with rejecting information
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };

    sendResponse(200, response, res);
  }
);
