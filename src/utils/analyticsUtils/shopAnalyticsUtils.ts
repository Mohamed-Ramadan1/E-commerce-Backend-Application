import mongoose from "mongoose";
import Product from "../../models/product/productModel";
import Order from "../../models/order/orderModel";
import Refund from "../../models/refundRequest/refundModel";
import ReturnItem from "../../models/product/returnProductsModel";

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

export async function getReturnInformation(
  shopId: string,
  start: Date,
  end: Date
) {
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

export async function getRefundInformation(
  shopId: string,
  start: Date,
  end: Date
) {
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

export async function getProductInformation(
  shopId: string,
  start: Date,
  end: Date
) {
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
