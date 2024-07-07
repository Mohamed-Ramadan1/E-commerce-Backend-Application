// system imports
import { Request, Response, NextFunction } from "express";

// models imports
import DeleteShopRequest from "../models/deleteShopRequestModal";
import ProcessedDeleteShopRequest from "../models/processedDeleteShopRequestModal";

// interface imports
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import { IProcessedDeletedShopRequest } from "../models/processedDeleteShopRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { DeleteShopRequestReq } from "../shared-interfaces/deleteShopRequestReq.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";
import User from "../models/userModel";
import { IUser } from "../models/user.interface";

export const validateBeforeApproveDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findById(id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    if (deleteShopRequest.requestStatus !== "pending") {
      return next(
        new AppError("Delete shop request is already processed", 400)
      );
    }

    req.shopOwner = deleteShopRequest.user as any;
    req.shop = deleteShopRequest.shop as any;
    req.deleteShopRequest = deleteShopRequest;

    next();
  }
);
