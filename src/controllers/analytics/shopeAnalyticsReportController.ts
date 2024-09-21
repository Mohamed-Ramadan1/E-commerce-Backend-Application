import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Shop from "../../models/shop/shopModal";
import Product from "../../models/product/productModel";
import Order from "../../models/order/orderModel";
import Refund from "../../models/refundRequest/refundModel";
import ReturnItem from "../../models/product/returnProductsModel";
import ShopAnalyticsReportReport from "../../models/analytics/shopeAnalyticsReportModel";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { IShopAnalyticsReport } from "models/analytics/shopeAnalyticsReport.interface";
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import sendShopReportEmail from "../../emails/analytics/shopAnalyticsReportEmail";

export const createShopAnalyticsReport = catchAsync(
  async (req: any, res: Response | null, next: NextFunction) => {
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

async function getFinancialInformation(shopId: string, start: Date, end: Date) {
  const orders = await Order.find({
    user: shopId,
    createdAt: { $gte: start, $lte: end },
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalRefund = await Refund.aggregate([
    {
      $match: {
        shop: new mongoose.Types.ObjectId(shopId),
        createdAt: { $gte: start, $lte: end },
        refundStatus: "Confirmed",
      },
    },
    { $group: { _id: null, total: { $sum: "$refundAmount" } } },
  ]).then((result) => result[0]?.total || 0);

  return {
    totalRevenue,
    totalRefund,
    averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
    totalProfit: totalRevenue - totalRefund,
  };
}

async function getOrdersInformation(shopId: string, start: Date, end: Date) {
  const orderCounts = await Order.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(shopId),
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalShippedOrders: {
          $sum: { $cond: [{ $eq: ["$shippingStatus", "shipped"] }, 1, 0] },
        },
        totalDeliveredOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
        },
        totalCancelledOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
        },
        totalPendingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    orderCounts[0] || {
      totalOrders: 0,
      totalShippedOrders: 0,
      totalDeliveredOrders: 0,
      totalCancelledOrders: 0,
      totalPendingOrders: 0,
    }
  );
}

async function getReturnInformation(shopId: string, start: Date, end: Date) {
  const returnCounts = await ReturnItem.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(shopId),
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalReturnItems: { $sum: 1 },
        totalAcceptedReturnItems: {
          $sum: { $cond: [{ $eq: ["$returnStatus", "Approved"] }, 1, 0] },
        },
        totalRejectedReturnItems: {
          $sum: { $cond: [{ $eq: ["$returnStatus", "Rejected"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    returnCounts[0] || {
      totalReturnItems: 0,
      totalAcceptedReturnItems: 0,
      totalRejectedReturnItems: 0,
    }
  );
}

async function getRefundInformation(shopId: string, start: Date, end: Date) {
  const refundCounts = await Refund.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(shopId),
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $group: {
        _id: null,
        totalRefundRequests: { $sum: 1 },
        totalAcceptedRefundRequests: {
          $sum: { $cond: [{ $eq: ["$refundStatus", "Confirmed"] }, 1, 0] },
        },
        totalRejectedRefundRequests: {
          $sum: { $cond: [{ $eq: ["$refundStatus", "Rejected"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    refundCounts[0] || {
      totalRefundRequests: 0,
      totalAcceptedRefundRequests: 0,
      totalRejectedRefundRequests: 0,
    }
  );
}

async function getProductInformation(shopId: string, start: Date, end: Date) {
  const productCounts = await Product.aggregate([
    { $match: { shopId: new mongoose.Types.ObjectId(shopId) } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalActiveProducts: {
          $sum: {
            $cond: [{ $eq: ["$availability_status", "Available"] }, 1, 0],
          },
        },
        totalInactiveProducts: {
          $sum: {
            $cond: [{ $eq: ["$availability_status", "Unavailable"] }, 1, 0],
          },
        },
        totalOutOfStockProducts: {
          $sum: { $cond: [{ $eq: ["$stock_quantity", 0] }, 1, 0] },
        },
        totalInStockProducts: {
          $sum: { $cond: [{ $gt: ["$stock_quantity", 0] }, 1, 0] },
        },
        totalFreezedProducts: {
          $sum: { $cond: [{ $eq: ["$freezed", true] }, 1, 0] },
        },
        totalUnFreezedProducts: {
          $sum: { $cond: [{ $eq: ["$freezed", false] }, 1, 0] },
        },
      },
    },
  ]);

  const newProducts = await Product.countDocuments({
    shopId: new mongoose.Types.ObjectId(shopId),
    createdAt: { $gte: start, $lte: end },
  });

  return {
    ...(productCounts[0] || {
      totalProducts: 0,
      totalActiveProducts: 0,
      totalInactiveProducts: 0,
      totalOutOfStockProducts: 0,
      totalInStockProducts: 0,
      totalFreezedProducts: 0,
      totalUnFreezedProducts: 0,
    }),
    newProducts,
  };
}
