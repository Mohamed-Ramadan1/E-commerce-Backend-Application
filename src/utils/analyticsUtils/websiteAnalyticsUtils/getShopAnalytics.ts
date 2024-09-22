import Shop from "../../../models/shop/shopModal";
import SubOrder from "../../../models/order/subOrderModal";
import ShopRequest from "../../../models/shop/shopRequestModal";
import DeleteShopRequest from "../../../models/shop/deleteShopRequestModal";
import ShopSupportTicket from "../../../models/supportTickets/shopSupportTicketModal";

export const getShopAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [
    totalShops,
    activeShops,
    inactiveShops,
    shopsWithProducts,
    newJoiningShops,
    shopsWithOrders,
    shopsSupportTickets,
    newShopsRequests,
    newDeleteShopsRequests,
  ] = await Promise.all([
    Shop.countDocuments(),
    Shop.countDocuments({ isActive: true }),
    Shop.countDocuments({ isActive: false }),
    Shop.countDocuments({ productCount: { $gt: 0 } }),
    Shop.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
    SubOrder.distinct("shop", {
      createdAt: { $gte: startDate, $lte: endDate },
    }).countDocuments(),
    ShopSupportTicket.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      shopId: { $exists: true },
    }),
    ShopRequest.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "pending",
    }),
    DeleteShopRequest.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      status: "pending",
    }),
  ]);

  return {
    totalShops,
    activeShops,
    inactiveShops,
    shopsWithProducts,
    newJoiningShops,
    shopsWithOrders,
    shopsSupportTickets,
    newShopsRequests,
    newDeleteShopsRequests,
  };
};
