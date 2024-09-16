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
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

// create new report
export const createReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const { shop, user } = req;
    const { reason, description } = req.body;
    const report: IReportShop = await ReportShop.create({
      reportedShop: shop._id,
      reportedBy: user._id,
      reason,
      description,
    });
    const response: ApiResponse<IReportShop> = {
      status: "success",
      data: report,
    };

    sendResponse(201, response, res);
  }
);

// get all reports
export const getAllReports = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ReportShop.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const reports: IReportShop[] = await features.execute();
    const response: ApiResponse<IReportShop[]> = {
      status: "success",
      results: reports.length,
      data: reports,
    };
    sendResponse(200, response, res);
  }
);

// get report by id
export const getReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const report: IReportShop | null = await ReportShop.findById(req.params.id);
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }
    const response: ApiResponse<IReportShop> = {
      status: "success",
      data: report,
    };
    sendResponse(200, response, res);
  }
);

// update  report
export const updateReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const report: IReportShop | null = await ReportShop.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }
    const response: ApiResponse<IReportShop> = {
      status: "success",
      data: report,
    };
    sendResponse(200, response, res);
  }
);

// delete report
export const deleteReport = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const report: IReportShop | null = await ReportShop.findByIdAndDelete(
      req.params.id
    );
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }
    const response: ApiResponse<IReportShop> = {
      status: "success",
      message: "Report deleted successfully",
    };
    sendResponse(204, response, res);
  }
);

// resolve report
export const resolveReport = catchAsync(
  async (req: ReportShopRequest, res: Response, next: NextFunction) => {
    const { report } = req;

    report.resolved = true;
    report.resolvedBy = req.user;
    report.resolvedAt = new Date();
    if (req.body.resolvedByComments !== undefined) {
      report.resolvedByComments = req.body.resolvedByComments;
    }

    const resolvedReport = await report.save();

    const response: ApiResponse<IReportShop> = {
      status: "success",
      message: "Report resolved successfully",
      data: resolvedReport,
    };
    sendResponse(200, response, res);
  }
);
