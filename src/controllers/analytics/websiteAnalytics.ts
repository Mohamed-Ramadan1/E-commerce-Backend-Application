import { Response, NextFunction } from "express";
import Product from "../../models/product/productModel";
import Shop from "../../models/shop/shopModal";
import Order from "../../models/order/orderModel";
import RefundRequest from "../../models/refundRequest/refundModel";
import DiscountCode from "../../models/discountCode/discountCodeModel";
import ReportShop from "../../models/reportShops/reportShopModel";
import User from "../../models/user/userModel";
import DeleteShopRequest from "../../models/shop/deleteShopRequestModal";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { AnalyticsRequest } from "requestsInterfaces/analytics/analyticsRequest";
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

interface WebsiteAnalyticsData {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  primeUsers: number;
  totalRefundRequests: number;
  totalRefunds: number;
  totalDiscountCodes: number;
  totalReturnRequests: number;
  approvedReturnRequests: number;
  approvedRefundRequests: number;
  totalShops: number;
  totalDeleteShopsRequests: number;
  totalShopsReports: number;
  totalUsers: number;
}

export const getWebsiteAnalytics = catchAsync(
  async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    const [
      totalProducts,
      totalOrders,
      cancelledOrders,
      totalSales,
      totalRefundRequests,
      totalRefunds,
      totalDiscountCodes,
      totalReturnRequests,
      approvedReturnRequests,
      approvedRefundRequests,
      totalShops,
      totalDeleteShopsRequests,
      totalShopsReports,
      totalUsers,
      primeUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $match: { orderStatus: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.countDocuments({ status: "refund-requested" }),
      RefundRequest.aggregate([
        { $match: { refundStatus: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$refundAmount" } } },
      ]),
      DiscountCode.countDocuments(),
      RefundRequest.countDocuments(),
      RefundRequest.countDocuments({ refundStatus: "confirmed" }),
      RefundRequest.countDocuments({ refundStatus: "confirmed" }),
      Shop.countDocuments(),
      DeleteShopRequest.countDocuments(),
      ReportShop.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ isPrimeUser: true }),
    ]);

    if (!totalSales.length || !totalRefunds.length) {
      return next(new AppError("No sales or refunds data found", 404));
    }

    const averageOrderValue =
      totalOrders > 0 ? totalSales[0].total / totalOrders : 0;

    const data: WebsiteAnalyticsData = {
      totalProducts,
      totalSales: totalSales[0].total,
      totalOrders,
      cancelledOrders,
      averageOrderValue,
      primeUsers,
      totalRefundRequests,
      totalRefunds: totalRefunds[0]?.total || 0,
      totalDiscountCodes,
      totalReturnRequests,
      approvedReturnRequests,
      approvedRefundRequests,
      totalShops,
      totalDeleteShopsRequests,
      totalShopsReports,
      totalUsers,
    };

    const response: ApiResponse<WebsiteAnalyticsData> = {
      status: "success",
      data,
    };

    sendResponse(200, response, res);
  }
);
