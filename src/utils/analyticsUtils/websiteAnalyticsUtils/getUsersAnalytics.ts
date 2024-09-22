import User from "../../../models/user/userModel";
import Order from "../../../models/order/orderModel";

export const getUserAnalytics = async () => {
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const [totalUsers, totalShopOwners, newUsers, usersWithOrders] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ myShop: { $exists: true } }),
      User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }),
      Order.distinct("userId", {
        createdAt: { $gte: startDate, $lte: endDate },
      }).countDocuments(),
    ]);

  // Calculate users with no orders
  const usersWithNoOrders = totalUsers - usersWithOrders;

  return {
    totalUsers,
    totalShopOwners,
    newUsers,
    usersWithOrders,
    usersWithNoOrders,
  };
};
