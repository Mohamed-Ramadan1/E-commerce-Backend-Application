import { NextFunction, Response } from "express";

// models imports
import ReturnProduct from "../models/returnProductsModel";
import Order from "../models/orderModel";
import RefundRequest from "../models/refundModel";
import User from "../models/userModel";

// interface imports
import { IReturnRequest } from "../models/returnProducts.interface";
import { IRefundRequest } from "../models/refund.interface";
import { IOrder } from "../models/order.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ReturnItemsRequest } from "../shared-interfaces/request.interface";
import { IUser } from "../models/user.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";

//emails imports
import refundRequestForReturnedItemsEmail from "../emails/users/refundRequestForReturnedItemsEmail";

// ----------------------------------------------------------------
//Users Operations

// create return product request
export const requestReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // orderId   ProductId  quantity   reason

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
    // create processed return document and delete the old one
    // handelProcessedReturnRequest(returnRequest, req.user, "Cancelled");

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

// reject item return request
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
