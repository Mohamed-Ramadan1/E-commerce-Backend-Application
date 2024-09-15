import { ObjectId } from "mongoose";

export interface IMonthlyShopAnalyticsReport {
  _id: ObjectId;
  shopId: ObjectId;
  shopName: string;
  shopEmail: string;
  month: string;
  year: number;

  // Financial Information
  financialInformation: {
    totalRevenue: number;
    totalRefund: number;
    averageOrderValue: number;
    totalProfit: number;
  };

  // orders
  orders: {
    totalOrders: number;
    totalShippedOrders: number;
    totalDeliveredOrders: number;
    totalCancelledOrders: number;
    totalPendingOrders: number;
  };

  // return information
  returnInformation: {
    totalReturnItems: number;
    totalAcceptedReturnItems: number;
    totalRejectedReturnItems: number;
  };

  //  refund  information
  refundInformation: {
    totalRefundRequests: number;
    totalAcceptedRefundRequests: number;
    totalRejectedRefundRequests: number;
  };

  //  product information
  productInformation: {
    totalProducts: number;
    totalActiveProducts: number;
    totalInactiveProducts: number;
    totalOutOfStockProducts: number;
    totalInStockProducts: number;
    totalFreezedProducts: number;
    totalUnFreezedProducts: number;
    newProducts: number;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
