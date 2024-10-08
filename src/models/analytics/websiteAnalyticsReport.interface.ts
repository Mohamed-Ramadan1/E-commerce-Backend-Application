import { ObjectId } from "mongoose";

export interface IWebsiteAnalyticsReport {
  _id: ObjectId;
  month: string;
  year: number;

  // Financial Summary for the Last 30 Days
  financialSummary: {
    totalSales: number;
    totalShopSales: number;
    totalWebsiteSales: number;
    totalProcessedRefunds: number;
    totalWebsiteProfit: number;
    averageOrderValue: number; // Moved here for relevance
  };

  // Shop Analytics
  shopAnalytics: {
    totalShops: number;
    activeShops: number;
    inactiveShops: number;
    shopsWithProducts: number;
    newJoiningShops: number;
    shopsWithOrders: number;
    shopsSupportTickets: number;
    newShopsRequests: number;
    newDeleteShopsRequests: number;
  };

  // Order Analytics
  orderAnalytics: {
    totalOrders: number;
    totalShopOrders: number;
    totalWebsiteOrders: number;
    totalPendingOrders: number;
    totalCancelledOrders: number;
    totalDeliveredOrders: number;
    totalReturnItems: number;
  };

  // Product Analytics
  productAnalytics: {
    totalProducts: number;
    totalShopProducts: number;
    totalWebsiteProducts: number;
    newProducts: number;
    totalOutOfStockProducts: number;
    totalInStockProducts: number;
  };

  // User Analytics
  userAnalytics: {
    totalUsers: number;
    totalShopOwners: number;
    newUsers: number;
    usersWithOrders: number;
    usersWithNoOrders: number;
  };
  // Refund Analytics
  refundAnalytics: {
    totalRefundRequests: number;
    totalProcessedRefundRequests: number;
    newRefundRequests: number;
    totalRefundRequestsForCancelledOrders: number;
    totalRefundRequestsForReturnItems: number;
    rejectedRefundRequests: number;
  };

  // Return Items Analytics
  returnItemsAnalytics: {
    totalReturnItemsRequests: number;
    totalProcessedReturnItemsRequests: number;
    newReturnItemsRequests: number;
    totalRejectedReturnItemsRequests: number;
    totalCancelledReturnItemsRequests: number;
  };

  // Support Ticket Analytics
  supportTicketAnalytics: {
    totalUsersSupportTickets: number;
    totalProcessedSupportTickets: number;
    newUserSupportTickets: number;
    totalShopSupportTickets: number;
    totalProcessedShopSupportTickets: number;
    newShopSupportTickets: number;
  };

  // prime subscription analytics
  primeSubscriptionAnalytics: {
    totalPrimeSubscriptions: number;
    newPrimeSubscriptions: number;
    totalActivePrimeSubscriptions: number;
    totalInactivePrimeSubscriptions: number;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
