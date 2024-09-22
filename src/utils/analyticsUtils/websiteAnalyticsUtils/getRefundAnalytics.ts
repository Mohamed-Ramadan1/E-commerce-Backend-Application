import RefundRequest from "../../../models/refundRequest/refundModel";
import {
  RefundStatus,
  RefundType,
} from "../../../models/refundRequest/refund.interface";

export const getRefundAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [
    totalRefundRequests,
    totalProcessedRefundRequests,
    newRefundRequests,
    totalRefundRequestsForCancelledOrders,
    totalRefundRequestsForReturnItems,
    rejectedRefundRequests,
  ] = await Promise.all([
    RefundRequest.countDocuments(),
    RefundRequest.countDocuments({ refundStatus: RefundStatus.Confirmed }),
    RefundRequest.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    }),
    RefundRequest.countDocuments({ refundType: RefundType.Cancellation }),
    RefundRequest.countDocuments({ refundType: RefundType.Return }),
    RefundRequest.countDocuments({ refundStatus: RefundStatus.Rejected }),
  ]);

  return {
    totalRefundRequests,
    totalProcessedRefundRequests,
    newRefundRequests,
    totalRefundRequestsForCancelledOrders,
    totalRefundRequestsForReturnItems,
    rejectedRefundRequests,
  };
};
