import { Schema, Model, model } from "mongoose";
import { IWebsiteAnalyticsReport } from "./websiteAnalyticsReport.interface";

const WebsiteAnalyticsReportSchema: Schema =
  new Schema<IWebsiteAnalyticsReport>(
    {
      month: { type: String, required: true },
      year: { type: Number, required: true },
      financialSummary: {
        totalSales: { type: Number, required: true },
        totalShopSales: { type: Number, required: true },
        totalWebsiteSales: { type: Number, required: true },
        totalProcessedRefunds: { type: Number, required: true },
        totalWebsiteProfit: { type: Number, required: true },
        averageOrderValue: { type: Number, required: true },
      },
      shopAnalytics: {
        totalShops: { type: Number, required: true },
        activeShops: { type: Number, required: true },
        inactiveShops: { type: Number, required: true },
        shopsWithProducts: { type: Number, required: true },
        newJoiningShops: { type: Number, required: true },
        shopsWithOrders: { type: Number, required: true },
        shopsSupportTickets: { type: Number, required: true },
        newShopsRequests: { type: Number, required: true },
        newDeleteShopsRequests: { type: Number, required: true },
      },
      orderAnalytics: {
        totalOrders: { type: Number, required: true },
        totalShopOrders: { type: Number, required: true },
        totalWebsiteOrders: { type: Number, required: true },
        totalPendingOrders: { type: Number, required: true },
        totalCancelledOrders: { type: Number, required: true },
        totalDeliveredOrders: { type: Number, required: true },
        totalReturnItems: { type: Number, required: true },
      },
      productAnalytics: {
        totalProducts: { type: Number, required: true },
        totalShopProducts: { type: Number, required: true },
        totalWebsiteProducts: { type: Number, required: true },
        newProducts: { type: Number, required: true },
        totalOutOfStockProducts: { type: Number, required: true },
        totalInStockProducts: { type: Number, required: true },
      },
      userAnalytics: {
        totalUsers: { type: Number, required: true },
        totalShopOwners: { type: Number, required: true },
        newUsers: { type: Number, required: true },
        usersWithOrders: { type: Number, required: true },
        usersWithNoOrders: { type: Number, required: true },
      },
      refundAnalytics: {
        totalRefundRequests: { type: Number, required: true },
        totalProcessedRefundRequests: { type: Number, required: true },
        newRefundRequests: { type: Number, required: true },
        totalRefundRequestsForCancelledOrders: { type: Number, required: true },
        totalRefundRequestsForReturnItems: { type: Number, required: true },
        rejectedRefundRequests: { type: Number, required: true },
      },
      returnItemsAnalytics: {
        totalReturnItemsRequests: { type: Number, required: true },
        totalProcessedReturnItemsRequests: { type: Number, required: true },
        newReturnItemsRequests: { type: Number, required: true },
        totalRejectedReturnItemsRequests: { type: Number, required: true },
        totalCancelledReturnItemsRequests: { type: Number, required: true },
      },

      supportTicketAnalytics: {
        totalUsersSupportTickets: { type: Number, required: true },
        totalProcessedSupportTickets: { type: Number, required: true },
        newUserSupportTickets: { type: Number, required: true },
        totalShopSupportTickets: { type: Number, required: true },
        totalProcessedShopSupportTickets: { type: Number, required: true },
        newShopSupportTickets: { type: Number, required: true },
      },
      primeSubscriptionAnalytics: {
        totalPrimeSubscriptions: { type: Number, required: true },
        totalActivePrimeSubscriptions: { type: Number, required: true },
        totalInactivePrimeSubscriptions: { type: Number, required: true },
        newPrimeSubscriptions: { type: Number, required: true },
      },
    },
    {
      timestamps: true,
    }
  );

const WebsiteAnalyticsReport: Model<IWebsiteAnalyticsReport> =
  model<IWebsiteAnalyticsReport>(
    "WebsiteAnalyticsReport",
    WebsiteAnalyticsReportSchema
  );

export default WebsiteAnalyticsReport;
