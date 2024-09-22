import ReturnProduct from "../../../models/product/returnProductsModel";
import SubOrder from "../../../models/order/subOrderModal";
import Order from "../../../models/order/orderModel";

export const getOrdersAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [
    totalOrders,
    totalShopOrders,
    totalWebsiteOrders,
    totalPendingOrders,
    totalCancelledOrders,
    totalDeliveredOrders,
    totalReturnItems,
  ] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    SubOrder.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      vendorType: "shop",
    }),
    SubOrder.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      vendorType: "website",
    }),
    Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "pending",
    }),
    Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "cancelled",
    }),
    Order.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "delivered",
    }),
    ReturnProduct.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    }),
  ]);

  return {
    totalOrders,
    totalShopOrders,
    totalWebsiteOrders,
    totalPendingOrders,
    totalCancelledOrders,
    totalDeliveredOrders,
    totalReturnItems,
  };
};
