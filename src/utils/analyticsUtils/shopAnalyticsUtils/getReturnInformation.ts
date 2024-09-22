import mongoose from "mongoose";
import ReturnItem from "../../../models/product/returnProductsModel";

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
