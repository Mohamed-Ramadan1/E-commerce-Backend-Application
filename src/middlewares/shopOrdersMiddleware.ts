// system imports
import { NextFunction, Response } from "express";

import Shop from "../models/shopModal";

import { IShop } from "../models/shop.interface";
import { ShopOrderRequest } from "../shared-interfaces/subOrderRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

export const validateBeforeShopOrdersOperations = catchAsync(
  async (req: ShopOrderRequest, res: Response, next: NextFunction) => {
    // validate user has shop and the order he tray to manipulate is related to his shop
    // extract the shop from the user and get it

    const shopId = req.user.myShop;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet and you can't access this resource.",
          400
        )
      );
    }
    req.shopId = shop._id;
    req.shop = shop;
    next();
  }
);
