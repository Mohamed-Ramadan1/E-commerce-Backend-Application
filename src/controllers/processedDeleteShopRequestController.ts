// system imports
import { Request, Response, NextFunction } from "express";

// models imports
import ProcessedDeleteShopRequest from "../models/processedDeleteShopRequestModal";

// interface imports
import { IProcessedDeletedShopRequest } from "../models/processedDeleteShopRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";

export const getAllProcessedDeleteShopRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      ProcessedDeleteShopRequest.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const processedDeleteShopRequests: IProcessedDeletedShopRequest[] =
      await features.execute();

    const response: ApiResponse<IProcessedDeletedShopRequest[]> = {
      status: "success",
      results: processedDeleteShopRequests.length,
      data: processedDeleteShopRequests,
    };

    sendResponse(200, response, res);
  }
);
export const getProcessedDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const processedDeleteShopRequest: IProcessedDeletedShopRequest | null =
      await ProcessedDeleteShopRequest.findById(req.params.id);

    if (!processedDeleteShopRequest) {
      return next(new AppError("Processed delete shop request not found", 404));
    }

    const response: ApiResponse<IProcessedDeletedShopRequest> = {
      status: "success",
      data: processedDeleteShopRequest,
    };

    sendResponse(200, response, res);
  }
);

export const createProcessedDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const processedDeleteShopRequest: IProcessedDeletedShopRequest =
      await ProcessedDeleteShopRequest.create(req.body);

    const response: ApiResponse<IProcessedDeletedShopRequest> = {
      status: "success",
      data: processedDeleteShopRequest,
    };

    sendResponse(201, response, res);
  }
);

export const updateProcessedDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const processedDeleteShopRequest: IProcessedDeletedShopRequest | null =
      await ProcessedDeleteShopRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!processedDeleteShopRequest) {
      return next(new AppError("Processed delete shop request not found", 404));
    }

    const response: ApiResponse<IProcessedDeletedShopRequest> = {
      status: "success",
      data: processedDeleteShopRequest,
    };

    sendResponse(200, response, res);
  }
);

export const deleteProcessedDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const processedDeleteShopRequest: IProcessedDeletedShopRequest | null =
      await ProcessedDeleteShopRequest.findByIdAndDelete(req.params.id);

    if (!processedDeleteShopRequest) {
      return next(new AppError("Processed delete shop request not found", 404));
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };

    sendResponse(204, response, res);
  }
);
