// system imports
import { NextFunction, Response } from "express";

// models imports
import User from "../../models/user/userModel";
import Shop from "../../models/shop/shopModal";
import ReportShop from "../../models/reportShops/reportShopModel";

// interface imports
import { IShop } from "../../models/shop/shop.interface";
import {
  IReportShop,
  ReportStatus,
} from "../../models/reportShops/reportShop.interface";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import { IUser } from "../../models/user/user.interface";
import { ReportShopRequest } from "../../requestsInterfaces/reportShops/reportShopRequest.interface";

// utils
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import { ObjectId } from "mongoose";

function validateBodyInformation(req: ReportShopRequest, next: NextFunction) {
  const { reportedShop, reason, description } = req.body;
  if (!reportedShop || !reason || !description) {
    return next(
      new AppError(
        "Please provide all required information(reportedShop,reportedBy,reason,description)",
        400
      )
    );
  }
}

async function checkShopExistence(shopId: ObjectId): Promise<IShop> {
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new AppError("Shop does not exist", 404);
  }
  return shop;
}

export const validateBeforeCreateReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    // validate request body information
    validateBodyInformation(req, next);

    const shop = await checkShopExistence(req.body.reportedShop);

    req.shop = shop;
    req.userToReport = req.user;
    next();
  }
);

// validation  middleware layer before resolve report
export const validateBeforeResolveReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const report: IReportShop | null = await ReportShop.findById(req.params.id);
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }

    if (report.resolved) {
      return next(new AppError("Report already resolved", 400));
    }

    req.report = report;
    next();
  }
);
