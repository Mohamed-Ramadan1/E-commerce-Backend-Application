import { Schema, Model, model } from "mongoose";
import { IShopAnalyticsReport } from "./shopeAnalyticsReport.interface";

const ShopAnalyticsReportSchema: Schema = new Schema<IShopAnalyticsReport>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    shopEmail: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },

    financialInformation: {
      totalRevenue: { type: Number, required: true },
      totalRefund: { type: Number, required: true },
      averageOrderValue: { type: Number, required: true },
      totalProfit: { type: Number, required: true },
    },

    orders: {
      totalOrders: { type: Number, required: true },
      totalShippedOrders: { type: Number, required: true },
      totalDeliveredOrders: { type: Number, required: true },
      totalCancelledOrders: { type: Number, required: true },
      totalPendingOrders: { type: Number, required: true },
      // totalReturnItems: { type: Number, required: true },
    },
    returnInformation: {
      totalReturnItems: { type: Number, required: true },
      totalAcceptedReturnItems: { type: Number, required: true },
      totalRejectedReturnItems: { type: Number, required: true },
    },
    refundInformation: {
      totalRefundRequests: { type: Number, required: true },
      totalAcceptedRefundRequests: { type: Number, required: true },
      totalRejectedRefundRequests: { type: Number, required: true },
    },
    productInformation: {
      totalProducts: { type: Number, required: true },
      totalActiveProducts: { type: Number, required: true },
      totalInactiveProducts: { type: Number, required: true },
      totalOutOfStockProducts: { type: Number, required: true },
      totalInStockProducts: { type: Number, required: true },
      totalFreezedProducts: { type: Number, required: true },
      totalUnFreezedProducts: { type: Number, required: true },
      newProducts: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const ShopAnalyticsReportModel: Model<IShopAnalyticsReport> =
  model<IShopAnalyticsReport>(
    "ShopAnalyticsReportModel",
    ShopAnalyticsReportSchema
  );

export default ShopAnalyticsReportModel;
