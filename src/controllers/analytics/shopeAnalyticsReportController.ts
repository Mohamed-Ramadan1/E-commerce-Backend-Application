import { Response, NextFunction } from "express";

import Shop from "../../models/shop/shopModal";

import ShopAnalyticsReportReport from "../../models/analytics/shopeAnalyticsReportModel";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { IShopAnalyticsReport } from "models/analytics/shopeAnalyticsReport.interface";
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import sendShopReportEmail from "../../emails/analytics/shopAnalyticsReportEmail";
import { ShopAnalyticsRequest } from "../../requestsInterfaces/analytics/shopAnalyticsRequest";
import {
  getFinancialInformation,
  getOrdersInformation,
  getRefundInformation,
  getProductInformation,
  getReturnInformation,
} from "../../utils/analyticsUtils/shopAnalyticsUtils";

// The  create controller is corn job run every start day of the month
export const createShopAnalyticsReport = catchAsync(
  async (
    req: ShopAnalyticsRequest,
    res: Response | null,
    next: NextFunction
  ) => {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("Shop not found", 404));
    }

    // Validate date range
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return next(new AppError("Invalid date range", 400));
    }

    // Generate report data
    const report: IShopAnalyticsReport = new ShopAnalyticsReportReport({
      shopId: shop._id,
      shopName: shop.shopName,
      shopEmail: shop.email,
      month: start.toLocaleString("default", { month: "long" }),
      year: start.getFullYear(),

      financialInformation: await getFinancialInformation(shopId, start, end),
      orders: await getOrdersInformation(shopId, start, end),
      returnInformation: await getReturnInformation(shopId, start, end),
      refundInformation: await getRefundInformation(shopId, start, end),
      productInformation: await getProductInformation(shopId, start, end),
    });

    // Save report to database
    const shopReport = await ShopAnalyticsReportReport.create(report);

    // Send email
    sendShopReportEmail(shop, shopReport);

    // Send response only if it's an HTTP request
    if (res) {
      const response: ApiResponse<IShopAnalyticsReport> = {
        status: "success",
        data: report,
      };
      sendResponse(201, response, res);
    }

    return shopReport;
  }
);

export const getShopAnalyticsReport = catchAsync(
  async (req: ShopAnalyticsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(new AppError("You not shop owner ", 404));
    }

    const report = await ShopAnalyticsReportReport.findOne({
      _id: id,
      shopId: shop,
    });

    if (!report) {
      return next(new AppError("Report not found", 404));
    }

    const response: ApiResponse<IShopAnalyticsReport> = {
      status: "success",

      data: report,
    };
    sendResponse(200, response, res);
  }
);

export const getAllShopAnalyticsReports = catchAsync(
  async (req: ShopAnalyticsRequest, res: Response, next: NextFunction) => {
    const shopId = req.user.myShop;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("Shop not found", 404));
    }

    const features = new APIFeatures(
      ShopAnalyticsReportReport.find({ shopId }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reports: any = await features.execute();

    const response: ApiResponse<IShopAnalyticsReport[]> = {
      status: "success",
      results: reports.length,
      data: reports,
    };
    sendResponse(200, response, res);
  }
);

//----------------------------------------------------------------------
// admin routes

// get report by id
export const getReport = catchAsync(
  async (req: ShopAnalyticsRequest, res: Response, next: NextFunction) => {
    const report = await ShopAnalyticsReportReport.findById(req.params.id);
    if (!report) {
      return next(new AppError("Report not found", 404));
    }

    const response: ApiResponse<IShopAnalyticsReport> = {
      status: "success",
      data: report,
    };
    sendResponse(200, response, res);
  }
);
// get all reports
export const getAllReports = catchAsync(
  async (req: ShopAnalyticsRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      ShopAnalyticsReportReport.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reports: any = await features.execute();
    const response: ApiResponse<IShopAnalyticsReport[]> = {
      status: "success",
      results: reports.length,
      data: reports,
    };
    sendResponse(200, response, res);
  }
);
// delete report
export const deleteReport = catchAsync(
  async (req: ShopAnalyticsRequest, res: Response, next: NextFunction) => {
    const report = await ShopAnalyticsReportReport.findByIdAndDelete(
      req.params.id
    );
    if (!report) {
      return next(new AppError("Report not found", 404));
    }

    const response: ApiResponse<null> = {
      status: "success",
      message: "Report deleted successfully",
      data: null,
    };
    sendResponse(204, response, res);
  }
);
