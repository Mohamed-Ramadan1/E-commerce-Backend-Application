import RefundRequest from "../models/refundModel";
import { IRefundRequest } from "../models/refund.interface";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { ApiResponse } from "../shared-interfaces/response.interface";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import {
  AuthUserRequest,
  RefundRequestReq,
} from "../shared-interfaces/request.interface";
import refundSuccessConfirmationEmail from "../utils/emails/refundsuccessConfirmationEmail";
/*
-- create refund request
-- get all refund  requests (not-confirmed)
-- get refund request (not-confirmed)
-- delete refund request 
-- confirm refund request 
-- reject refund request 

-- get all refund requests (confirmed)
-- get refund request (confirmed)

*/

// all controller in this file related to the admins only

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

export const getAllRefundRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refundRequests: IRefundRequest[] = await RefundRequest.find();
    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      results: refundRequests.length,
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getAllRefundRequestsNotConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refundRequests: IRefundRequest[] = await RefundRequest.find({
      refundStatus: "pending",
    });
    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      results: refundRequests.length,
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);
export const getAllRefundRequestsConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refundRequests: IRefundRequest[] = await RefundRequest.find({
      refundStatus: "confirmed",
    });
    const response: ApiResponse<IRefundRequest[]> = {
      status: "success",
      data: refundRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getRefundRequest = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
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

export const deleteRefundRequest = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
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

export const confirmRefundRequest = catchAsync(
  async (req: RefundRequestReq, res: Response, next: NextFunction) => {
    // all validation happen on the middleware stage.

    const { refundRequest, userToRefund, order } = req;
    // update the refund request
    userToRefund.giftCard += refundRequest.refundAmount;
    await userToRefund.save({ validateBeforeSave: false });
    refundRequest.refundStatus = "confirmed";
    refundRequest.processedBy = req.user._id;
    refundRequest.refundProcessedAt = new Date();
    await refundRequest.save();

    //send confirmation email
    refundSuccessConfirmationEmail(userToRefund, refundRequest);

    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(200, response, res);
  }
);

export const rejectRefundRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refundRequest: IRefundRequest | null = await RefundRequest.findOne({
      _id: req.params.id,
    });
    if (!refundRequest) {
      return next(new AppError("Refund request not found", 404));
    }
    if (refundRequest.refundStatus === "rejected") {
      return next(new AppError("Refund request is already rejected", 400));
    }

    refundRequest.refundStatus = "rejected";
    await refundRequest.save();
    const response: ApiResponse<IRefundRequest> = {
      status: "success",
      data: refundRequest,
    };
    sendResponse(200, response, res);
  }
);
