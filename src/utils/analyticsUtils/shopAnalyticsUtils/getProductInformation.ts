import mongoose from "mongoose";
import Product from "../../../models/product/productModel";

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
