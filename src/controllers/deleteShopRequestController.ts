// system imports
import { Request, Response, NextFunction } from "express";

// models imports
import DeleteShopRequest from "../models/deleteShopRequest";
import ProcessedDeleteShopRequest from "../models/processedDeleteShopRequestModal";

// interface imports
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import { IProcessedDeletedShopRequest } from "../models/processedDeleteShopRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

export const getAllDeleteShopRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteShopRequests: IDeleteShopRequest[] =
      await DeleteShopRequest.find();

    const response: ApiResponse<IDeleteShopRequest[]> = {
      status: "success",
      data: deleteShopRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findById(req.params.id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(200, response, res);
  }
);

export const createDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest =
      await DeleteShopRequest.create(req.body);

    if (!deleteShopRequest) {
      return next(new AppError("Something went wrong", 400));
    }
    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(201, response, res);
  }
);

export const updateDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(200, response, res);
  }
);

export const deleteDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findByIdAndDelete(req.params.id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);


// TODO: this three routes related to processed collection data
export const approveDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

  }
);

export const rejectDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const cancelDeleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
