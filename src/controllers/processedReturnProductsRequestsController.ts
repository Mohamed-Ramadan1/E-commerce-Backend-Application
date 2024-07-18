// system imports
import { NextFunction, Response } from "express";

import ProcessedReturnProductRequest from "../models/processedReturnProductsModal";

// interface imports
import { IProcessedReturnProductRequest } from "../models/processedReturnProducts.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ProcessedReturnProductRequestReq } from "../shared-interfaces/processedReturnProductsRequestsReq.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

export const getProcessedReturnProductRequests = catchAsync(
  async (
    req: ProcessedReturnProductRequestReq,
    res: Response,
    next: NextFunction
  ) => {
    const processedReturnProductRequests: IProcessedReturnProductRequest[] =
      await ProcessedReturnProductRequest.find();

    const response: ApiResponse<IProcessedReturnProductRequest[]> = {
      status: "success",
      results: processedReturnProductRequests.length,
      data: processedReturnProductRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getProcessedReturnProductRequest = catchAsync(
  async (
    req: ProcessedReturnProductRequestReq,
    res: Response,
    next: NextFunction
  ) => {
    const processedReturnProductRequest: IProcessedReturnProductRequest | null =
      await ProcessedReturnProductRequest.findById(req.params.id);

    if (!processedReturnProductRequest) {
      return next(
        new AppError("No processed refund request found with this id.", 404)
      );
    }

    const response: ApiResponse<IProcessedReturnProductRequest> = {
      status: "success",
      data: processedReturnProductRequest,
    };
    sendResponse(200, response, res);
  }
);

export const updateProcessedReturnProductRequest = catchAsync(
  async (
    req: ProcessedReturnProductRequestReq,
    res: Response,
    next: NextFunction
  ) => {
    const processedReturnProductRequest: IProcessedReturnProductRequest | null =
      await ProcessedReturnProductRequest.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!processedReturnProductRequest) {
      return next(
        new AppError("No processed refund request found with this id", 404)
      );
    }

    const response: ApiResponse<IProcessedReturnProductRequest> = {
      status: "success",
      data: processedReturnProductRequest,
    };
    sendResponse(200, response, res);
  }
);

export const deleteProcessedReturnProductRequest = catchAsync(
  async (
    req: ProcessedReturnProductRequestReq,
    res: Response,
    next: NextFunction
  ) => {
    const processedReturnProductRequest: IProcessedReturnProductRequest | null =
      await ProcessedReturnProductRequest.findByIdAndDelete(req.params.id);

    if (!processedReturnProductRequest) {
      return next(
        new AppError("No processed refund request found with this id.", 404)
      );
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);
