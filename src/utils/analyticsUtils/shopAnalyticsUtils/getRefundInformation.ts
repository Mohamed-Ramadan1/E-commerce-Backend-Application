import mongoose from "mongoose";
import Refund from "../../../models/refundRequest/refundModel";

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
