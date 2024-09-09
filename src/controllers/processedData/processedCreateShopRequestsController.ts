// system imports
import { Response, NextFunction } from "express";

// model imports

import ProcessedCreateShopRequests from "../../models/processedData/processedCreateShopRequestsModal";

// interface imports
import { IProcessedShopRequest } from "../../models/processedData/processedCreateShopRequests.interface";
import { ProcessedShopRequestsReq } from "../../RequestsInterfaces/processedShopRequestsReq.interface";
import { ApiResponse } from "../../RequestsInterfaces/response.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

export const getAllProcessedShopRequests = catchAsync(
  async (req: ProcessedShopRequestsReq, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      ProcessedCreateShopRequests.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const processedShopRequests: IProcessedShopRequest[] =
      await features.execute();

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
