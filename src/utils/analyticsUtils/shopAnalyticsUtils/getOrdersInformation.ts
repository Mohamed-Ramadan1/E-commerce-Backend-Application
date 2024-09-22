import mongoose from "mongoose";

import Order from "../../../models/order/orderModel";

export async function getOrdersInformation(
  shopId: string,
  start: Date,
  end: Date
) {
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
