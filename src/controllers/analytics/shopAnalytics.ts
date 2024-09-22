// system imports
import { Response, NextFunction } from "express";

// models  imports
import Product from "../../models/product/productModel";
import Shop from "../../models/shop/shopModal";
import SubOrder from "../../models/order/subOrderModal";

// interface imports
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { AnalyticsRequest } from "../../requestsInterfaces/analytics/analyticsRequest";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { IShop } from "../../models/shop/shop.interface";

interface ShopAnalyticsData {
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  cancelledOrders: number;
}

// this is a controller function that handles the request to get the analytics data for a shop
export const getShopAnalytics = catchAsync(
  async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    const shopId = req.params.shopId;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const totalProducts = await Product.countDocuments({ shop: shopId });
    const totalOrders = await SubOrder.countDocuments({ shop: shopId });
    const cancelledOrders = await SubOrder.countDocuments({
      shop: shopId,
      status: "cancelled",
    });
    const totalSales = await SubOrder.aggregate([
      {
        $match: {
          shop: shopId,
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$netPrice" },
        },
      },
    ]);
    const data: ShopAnalyticsData = {
      totalProducts,
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      cancelledOrders,
    };
    const response: ApiResponse<ShopAnalyticsData> = {
      status: "success",
      data,
    };
    sendResponse(200, response, res);
  }
);
