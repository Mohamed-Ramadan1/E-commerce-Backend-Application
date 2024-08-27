// system imports
import { NextFunction, Response } from "express";
import crypto from "crypto";

// external modules imports
import validator from "validator";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IShop } from "../models/shop.interface";
import {
  ShopSettingsRequest,
  VerifyShopEmailUpdating,
} from "../shared-interfaces/shopRequests.interface";

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

export const validateBeforeConfirmUpdateShopEmailAddress = catchAsync(
  async (req: VerifyShopEmailUpdating, res: Response, next: NextFunction) => {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // validate token
    const shop: IShop | null = await Shop.findOne({
      changeEmailVerificationToken: hashedToken,
      changeEmailVerificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!shop) {
      return next(new AppError("Invalid token or expired token", 400));
    }
    const user = await User.findById(shop.owner);
    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }
    req.shop = shop;
    req.user = user;
    next();
  }
);

export const validateBeforeUpdateShopInfo = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const shop: IShop | null = await Shop.findOne({ owner: user._id });

    // check if the user has a shop
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop . you can apply for shop request to open your own shop",
          404
        )
      );
    }

    // check if the shop is un-active
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is un-activated you can't update the shop information",
          400
        )
      );
    }

    // check if the user try to update shop-email
    if (req.body.email) {
      return next(
        new AppError(
          "You can't update the email of the shop using this route you can use rout /my-shop/update-email to update the email.",
          400
        )
      );
    }
    // check if the user try to update shop-banner
    if (req.body.banner) {
      return next(
        new AppError(
          "You can't update the banner of the shop using this route you can use rout /my-shop/banner to update the banner.",
          400
        )
      );
    }
    // check if the user try to update shop-categories
    if (req.body.categories) {
      return next(
        new AppError(
          "You can't update the categories of the shop using this route.",
          400
        )
      );
    }

    // check if the user try to update shop-owner
    if (req.body.owner) {
      return next(new AppError("You can't change the shop owner.", 400));
    }

    // add the shop to the request
    req.shop = shop;

    next();
  }
);

export const validateBeforeUpdateBanner = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const { shopDescription, shopName, shopPhoneNumber, photo } = req.body;
    if (shopDescription || shopName || shopPhoneNumber || photo) {
      return next(
        new AppError(
          "You can't update shop description, shop name, shop phone number or photo using this route. this only for updating the shop banner",
          400
        )
      );
    }

    // check if the user try to update shop-email
    if (req.body.email) {
      return next(
        new AppError(
          "You can't update the email of the shop using this route you can use rout /my-shop/update-email to update the email.",
          400
        )
      );
    }

    // check if the user try to update shop-categories
    if (req.body.categories) {
      return next(
        new AppError(
          "You can't update the categories of the shop using this route.",
          400
        )
      );
    }

    // check if the user try to update shop-owner
    if (req.body.owner) {
      return next(new AppError("You can't change the shop owner.", 400));
    }

    const user = req.user;
    const shop: IShop | null = await Shop.findOne({ owner: user._id });

    // check if the user has a shop
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop . you can apply for shop request to open your own shop",
          404
        )
      );
    }

    // check if the shop is un-active
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is un-activated you can't update the shop information",
          400
        )
      );
    }

    // add the shop to the request
    req.shop = shop;

    next();
  }
);
