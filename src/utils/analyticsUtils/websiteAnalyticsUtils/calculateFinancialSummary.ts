import Order from "../../../models/order/orderModel";
import SubOrder from "../../../models/order/subOrderModal";
import RefundRequest from "../../../models/refundRequest/refundModel";

export const calculateFinancialSummary = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const matchStage = {
    orderStatus: "delivered",
    createdAt: { $gte: thirtyDaysAgo },
  };

  // Total Sales calculation
  const totalSales = await Order.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  // Total Shop Sales calculation
  const totalShopSales = await SubOrder.aggregate([
    { $match: { ...matchStage, user: { $ne: null } } },
    { $group: { _id: null, totalShopSales: { $sum: "$netPrice" } } },
  ]);

  // Total Website Sales calculation
  const totalWebsiteSales = await Order.aggregate([
    { $match: { ...matchStage, user: { $eq: null } } },
    { $group: { _id: null, totalWebsiteSales: { $sum: "$totalPrice" } } },
  ]);

  // Total Processed Refunds calculation
  const totalProcessedRefunds = await RefundRequest.aggregate([
    {
      $match: { refundStatus: "confirmed", createdAt: { $gte: thirtyDaysAgo } },
    },
    { $group: { _id: null, totalRefunds: { $sum: "$refundAmount" } } },
  ]);

  // Count of orders for average calculation
  const orderCount = await Order.countDocuments(matchStage);

  // Calculations with null checks
  const totalSalesAmount = totalSales[0]?.totalSales || 0;
  const totalShopSalesAmount = totalShopSales[0]?.totalShopSales || 0;
  const totalWebsiteSalesAmount = totalWebsiteSales[0]?.totalWebsiteSales || 0;
  const totalRefundsAmount = totalProcessedRefunds[0]?.totalRefunds || 0;

  const totalWebsiteProfit = totalSalesAmount - totalRefundsAmount;
  const averageOrderValue = orderCount > 0 ? totalSalesAmount / orderCount : 0;

  return {
    totalSales: totalSalesAmount,
    totalShopSales: totalShopSalesAmount,
    totalWebsiteSales: totalWebsiteSalesAmount,
    totalProcessedRefunds: totalRefundsAmount,
    totalWebsiteProfit,
    averageOrderValue,
    orderCount,
  };
};
