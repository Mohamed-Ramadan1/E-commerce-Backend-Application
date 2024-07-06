// system imports
import { NextFunction, Request, Response } from "express";

// external modules imports
import validator from "validator";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { ShopSettingsRequest } from "../shared-interfaces/request.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

export const validateBeforeUpdateShopEmailAddress = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    // validate new email send on the request
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return next(new AppError("Please provide a valid email", 400));
    }

    // get the user and check if he has the a shop.
    const user = req.user;

    const shop: IShop | null = await Shop.findOne({ owner: user._id });
    if (!shop) {
      return next(new AppError("No shop found for this user", 404));
    }

    // get the shop and check if he is active
    if (!shop.isActive) {
      return next(
        new AppError(
          "Shop is not active you cant update data for the not-active shop.",
          400
        )
      );
    }
    // check if the new email is already in use and also no shop use the new email
    const existUserWithEmail = await User.findOne({ email });
    const existShopWithEmail = await Shop.findOne({ email });
    if (
      existUserWithEmail &&
      existUserWithEmail._id.toString() !== user._id.toString()
    ) {
      return next(new AppError("Email already in use", 400));
    }
    if (
      existShopWithEmail &&
      existShopWithEmail._id.toString() !== shop._id.toString()
    ) {
      return next(new AppError("Email already in use", 400));
    }

    // check if the new email is different from the old one
    if (email === shop.email) {
      return next(
        new AppError(
          "New email is same as the old one, please provide a new email.",
          400
        )
      );
    }

    // check if the new email is different from the user email
    if (email === user.email) {
      return next(
        new AppError(
          "New email is same as the current email, please provide a new email.",
          400
        )
      );
    }

    req.shop = shop;
    next();
  }
);
