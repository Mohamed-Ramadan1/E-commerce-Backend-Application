// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import RefundRequest from "../models/refundModel";
import ProcessedRefundRequests from "../models/processedRefundRequestsModal";

// interface imports
import { IRefundRequest, RefundStatus } from "../models/refund.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { RefundRequestReq } from "../shared-interfaces/refundRequestReq.interface";
import { IUser } from "../models/user.interface";
import { IOrder } from "../models/order.interface";

// utils
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";

// emails imports
import refundSuccessConfirmationEmail from "../emails/admins/refundsuccessConfirmationEmail";

// Helpers functions

const handelProcessedRefundRequest = async (
  userToRefund: IUser,
  order: IOrder,
  refundRequest: IRefundRequest,
  user: IUser,
  next: NextFunction,
  refundStatus: string
) => {
  // create processed document and delete the original refund request
  const processedRefundRequest = await ProcessedRefundRequests.create({
    user: {
      _id: userToRefund._id,
      email: userToRefund.email,
      name: userToRefund.name,
      phoneNumber: userToRefund.phoneNumber,
    },
    order: order,
    processedBy: {
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
    refundAmount: refundRequest.refundAmount,
    refundMethod: refundRequest.refundMethod,
    refundType: refundRequest.refundType,
    refundStatus,
    refundProcessedAt: new Date(),
    refundCreatedAt: refundRequest.createdAt,
    refundLastUpdate: refundRequest.updatedAt,
  });

  if (!processedRefundRequest) {
    return next(new AppError("Error while processing refund request", 500));
  }

  // await RefundRequest.deleteOne({ _id: refundRequest._id });
};

// all controller functions  in this file related to the admins only

// create refund request
export const createRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const refundRequest: IRefundRequest = await RefundRequest.create({
      user: req.body.user,
      order: req.body.order,
      refundAmount: req.body.refundAmount,
      refundMethod: req.body.refundMethod,
      refundType: req.body.refundType,
    });

    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(201, response, res);
  }
);

// get all refund requests
export const getAllRefundRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(RefundRequest.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const refundRequests: IRefundRequest[] = await features.execute();
    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      results: refundRequests.length,
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);

// get all refund requests not confirmed
export const getAllRefundRequestsNotConfirmed = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      RefundRequest.find({
        refundStatus: "pending",
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const refundRequests: IRefundRequest[] = await features.execute();

    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      results: refundRequests.length,
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);

// get all refund requests confirmed
export const getAllRefundRequestsConfirmed = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      RefundRequest.find({
        refundStatus: "confirmed",
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const refundRequests: IRefundRequest[] = await features.execute();

    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);

// get refund request by id
export const getRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const refundRequest: IRefundRequest | null = await RefundRequest.findById(
      id
    );
    if (!refundRequest) {
      return next(new AppError("Refund request not found", 404));
    }
    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(200, response, res);
  }
);

// delete refund request
export const deleteRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const refundRequest: IRefundRequest | null =
      await RefundRequest.findByIdAndDelete({
        _id: id,
      });
    if (!refundRequest) {
      return next(new AppError("No Refund Request with this id", 404));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

// confirm refund request
export const confirmRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    // all validation happen on the middleware stage.

    const { refundRequest, userToRefund, order } = req;
    // update the refund request
    userToRefund.giftCard += refundRequest.refundAmount;
    await userToRefund.save({ validateBeforeSave: false });
    refundRequest.refundStatus = RefundStatus.Confirmed;
    refundRequest.processedBy = req.user._id;
    refundRequest.refundProcessedAt = new Date();
    await refundRequest.save();

    //send confirmation email
    refundSuccessConfirmationEmail(userToRefund, refundRequest);

    // create processed refund request document and delete the original refund request.
    handelProcessedRefundRequest(
      userToRefund,
      order,
      refundRequest,
      req.user,
      next,
      "confirmed"
    );

    // await ProcessedRefundRequests.create({
    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(200, response, res);
  }
);

// reject refund request
export const rejectRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    const refundRequest: IRefundRequest | null = await RefundRequest.findOne({
      _id: req.params.id,
    });
    if (!refundRequest) {
      return next(new AppError("Refund request not found", 404));
    }
    if (refundRequest.refundStatus === "rejected") {
      return next(new AppError("Refund request is already rejected", 400));
    }
    const { userToRefund, order } = req;
    refundRequest.refundStatus = RefundStatus.Rejected;
    await refundRequest.save();

    handelProcessedRefundRequest(
      userToRefund,
      order,
      refundRequest,
      req.user,
      next,
      "rejected"
    );
    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(200, response, res);
  }
);
