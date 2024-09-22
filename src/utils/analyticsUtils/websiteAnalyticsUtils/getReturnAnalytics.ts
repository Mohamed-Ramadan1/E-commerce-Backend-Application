import ReturnProduct from "../../../models/product/returnProductsModel";
import { ReturnStatus } from "../../../models/product/returnProducts.interface";

export const getReturnAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [
    totalReturnItemsRequests,
    totalProcessedReturnItemsRequests,
    newReturnItemsRequests,
    totalRejectedReturnItemsRequests,
    totalCancelledReturnItemsRequests,
  ] = await Promise.all([
    ReturnProduct.countDocuments(),
    ReturnProduct.countDocuments({ returnStatus: ReturnStatus.Approved }),
    ReturnProduct.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    }),
    ReturnProduct.countDocuments({ returnStatus: ReturnStatus.Rejected }),
    ReturnProduct.countDocuments({ returnStatus: ReturnStatus.Cancelled }),
  ]);

  return {
    totalReturnItemsRequests,
    totalProcessedReturnItemsRequests,
    newReturnItemsRequests,
    totalRejectedReturnItemsRequests,
    totalCancelledReturnItemsRequests,
  };
};
