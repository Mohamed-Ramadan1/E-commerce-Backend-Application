// system imports
import { Response, NextFunction } from "express";

// model imports

import ProcessedCreateShopRequests from "../models/processedCreateShopRequestsModal";

// interface imports
import { IUser } from "../models/user.interface";
import { IProcessedShopRequest } from "../models/processedCreateShopRequests.interface";
import { ProcessedShopRequestsReq } from "../shared-interfaces/processedShopRequestsReq.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

/*
TODO :create processed shop request
//TODO: get all processed shop requests
//TODO: get processed shop request
//TODO: update processed shop request
//TODO: delete processed shop request
*/

export const getAllProcessedShopRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const processedShopRequests: IProcessedShopRequest[] =
      await ProcessedCreateShopRequests.find();

    const responses: ApiResponse<IProcessedShopRequest[]> = {
      status: "success",
      results: processedShopRequests.length,
      data: processedShopRequests,
    };

    sendResponse(200, responses, res);
  }
);

export const getProcessedShopRequest = catchAsync(
  async (req: ProcessedShopRequestsReq, res: Response, next: NextFunction) => {
    const processedShopRequest: IProcessedShopRequest | null =
      await ProcessedCreateShopRequests.findById(req.params.id);

    if (!processedShopRequest) {
      return next(new AppError("Processed shop request not found", 404));
    }

    const response: ApiResponse<IProcessedShopRequest> = {
      status: "success",
      data: processedShopRequest,
    };

    sendResponse(200, response, res);
  }
);

export const updateProcessedShopRequest = catchAsync(
  async (req: ProcessedShopRequestsReq, res: Response, next: NextFunction) => {
    const processedShopRequest: IProcessedShopRequest | null =
      await ProcessedCreateShopRequests.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

    if (!processedShopRequest) {
      return next(new AppError("Processed shop request not found", 404));
    }

    const response: ApiResponse<IProcessedShopRequest> = {
      status: "success",
      data: processedShopRequest,
    };

    sendResponse(200, response, res);
  }
);

export const deleteProcessedShopRequest = catchAsync(
  async (req: ProcessedShopRequestsReq, res: Response, next: NextFunction) => {
    const processedShopRequest: IProcessedShopRequest | null =
      await ProcessedCreateShopRequests.findByIdAndDelete(req.params.id);

    if (!processedShopRequest) {
      return next(new AppError("Processed shop request not found", 404));
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };

    sendResponse(204, response, res);
  }
);
