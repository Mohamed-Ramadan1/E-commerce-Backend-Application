import mongoose from "mongoose";
import Order from "../../../models/order/orderModel";
import Refund from "../../../models/refundRequest/refundModel";

export async function getFinancialInformation(
  shopId: string,
  start: Date,
  end: Date
) {
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
