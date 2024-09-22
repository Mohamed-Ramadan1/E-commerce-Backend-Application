// system imports
import { Response, NextFunction } from "express";

// interface imports
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { WebsiteAnalyticsRequest } from "../../requestsInterfaces/analytics/websiteAnalyticsRequest";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import WebsiteAnalyticsReport from "../../models/analytics/websiteAnalyticsReportModal";
import { IWebsiteAnalyticsReport } from "../../models/analytics/websiteAnalyticsReport.interface";

import { calculateFinancialSummary } from "../../utils/analyticsUtils/websiteAnalyticsUtils/calculateFinancialSummary";
import { getShopAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getShopAnalytics";
import { getOrdersAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getOrdersAnalytics";
import { getProductsAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getProductsAnalytics";
import { getUserAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getUsersAnalytics";
import { getRefundAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getRefundAnalytics";
import { getReturnAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getReturnAnalytics";
import { calculateSupportTicketAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getSupportTicketsAnalytics";
import { getPrimeSubscriptionAnalytics } from "../../utils/analyticsUtils/websiteAnalyticsUtils/getPrimeSubscriptionsAnalytics";

import sendWebsiteAnalyticsReportEmail from "../../emails/analytics/websiteAnalyticsReportEmail";

// generate report
export const createWebsiteAnalyticsReport = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    const startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
    const year = endDate.getFullYear();
    const month = endDate.toLocaleString("default", { month: "long" });

    // Check if a report for the current month and year already exists
    const existingReport = await WebsiteAnalyticsReport.findOne({
      month,
      year,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    if (existingReport) {
      return next(
        new AppError("A report for the last 30 days already exists", 400)
      );
    }

    // Gather all analytics data
    const financialSummary = await calculateFinancialSummary();
    const shopAnalytics = await getShopAnalytics();
    const orderAnalytics = await getOrdersAnalytics();
    const productAnalytics = await getProductsAnalytics();
    const userAnalytics = await getUserAnalytics();
    const refundAnalytics = await getRefundAnalytics();
    const returnItemsAnalytics = await getReturnAnalytics();
    const supportTicketAnalytics = await calculateSupportTicketAnalytics();
    const primeSubscriptionAnalytics = await getPrimeSubscriptionAnalytics();

    // Create the new report
    const newReport: IWebsiteAnalyticsReport =
      await WebsiteAnalyticsReport.create({
        month,
        year,
        financialSummary,
        shopAnalytics,
        orderAnalytics,
        productAnalytics,
        userAnalytics,
        refundAnalytics,
        returnItemsAnalytics,
        supportTicketAnalytics,
        primeSubscriptionAnalytics,
      });

    // Send email with the report
    const staticEmailRecipient = "mohamedramadan11b@gmail.com";
    sendWebsiteAnalyticsReportEmail(newReport, staticEmailRecipient);

    const response: ApiResponse<IWebsiteAnalyticsReport> = {
      status: "success",
      message: "Website analytics report created successfully",
      data: newReport,
    };

    // Send the response
    sendResponse(201, response, res);
  }
);

//--------------------------------------------------------------------------------------
//get all  reports
export const getAllWebsiteAnalyticsReports = catchAsync(
  async (req: WebsiteAnalyticsRequest, res: Response, next: NextFunction) => {
    const reports = new APIFeatures(WebsiteAnalyticsReport.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reportsData: any = await reports.execute();

    const response: ApiResponse<IWebsiteAnalyticsReport[]> = {
      status: "success",
      results: reportsData.length,
      data: reportsData,
    };
    sendResponse(200, response, res);
  }
);

// get report with id
export const getWebsiteAnalyticsReport = catchAsync(
  async (req: WebsiteAnalyticsRequest, res: Response, next: NextFunction) => {
    const report: IWebsiteAnalyticsReport | null =
      await WebsiteAnalyticsReport.findById(req.params.id);
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }
    const response: ApiResponse<IWebsiteAnalyticsReport> = {
      status: "success",
      data: report,
    };
    sendResponse(200, response, res);
  }
);

// delete report with id
export const deleteWebsiteAnalyticsReport = catchAsync(
  async (req: WebsiteAnalyticsRequest, res: Response, next: NextFunction) => {
    const report: IWebsiteAnalyticsReport | null =
      await WebsiteAnalyticsReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return next(new AppError("No report found with that ID", 404));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);
