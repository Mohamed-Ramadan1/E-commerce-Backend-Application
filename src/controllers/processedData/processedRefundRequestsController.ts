// system imports
import { NextFunction, Response } from "express";

import ProcessedRefundRequests from "../../models/processedData/processedRefundRequestsModal";

// interface imports
import { IProcessedRefundRequests } from "../../models/processedData/processedRefundRequests.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { ProcessedRefundRequestReq } from "../../shared-interfaces/processedRefundRequestsReq.interface";

// utils imports
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/ApplicationError";
import APIFeatures from "../../utils/apiKeyFeature";
import { sendResponse } from "../../utils/sendResponse";

//emails imports

// get all processed refund requests
export const getProcessedRefundRequests = catchAsync(
  async (req: ProcessedRefundRequestReq, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ProcessedRefundRequests.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const processedRefundRequests: IProcessedRefundRequests[] =
      await features.execute();

    const response: ApiResponse<IProcessedRefundRequests[]> = {
      status: "success",
      results: processedRefundRequests.length,
      data: processedRefundRequests,
    };
    sendResponse(200, response, res);
  }
);

// get a single processed refund request
export const getProcessedRefundRequest = catchAsync(
  async (req: ProcessedRefundRequestReq, res: Response, next: NextFunction) => {
    const processedRefundRequest: IProcessedRefundRequests | null =
      await ProcessedRefundRequests.findById(req.params.id);

    if (!processedRefundRequest) {
      return next(
        new AppError("No processed refund request found with this id.", 404)
      );
    }

    const response: ApiResponse<IProcessedRefundRequests> = {
      status: "success",
      data: processedRefundRequest,
    };
    sendResponse(200, response, res);
  }
);

// update a processed refund request
export const updateProcessedRefundRequest = catchAsync(
  async (req: ProcessedRefundRequestReq, res: Response, next: NextFunction) => {
    const processedRefundRequest: IProcessedRefundRequests | null =
      await ProcessedRefundRequests.findById(req.params.id);

    if (!processedRefundRequest) {
      return next(
        new AppError("No processed refund request found with this id", 404)
      );
    }

    const updatedProcessedRefundRequest: IProcessedRefundRequests | null =
      await ProcessedRefundRequests.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    const response: ApiResponse<IProcessedRefundRequests | null> = {
      status: "success",
      data: updatedProcessedRefundRequest,
    };
    sendResponse(200, response, res);
  }
);

// delete a processed refund request
export const deleteProcessedRefundRequest = catchAsync(
  async (req: ProcessedRefundRequestReq, res: Response, next: NextFunction) => {
    const processedRefundRequest: IProcessedRefundRequests | null =
      await ProcessedRefundRequests.findById(req.params.id);

    if (!processedRefundRequest) {
      return next(
        new AppError("No processed refund request found with this id.", 404)
      );
    }

    await ProcessedRefundRequests.deleteOne({ _id: req.params.id });

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);
