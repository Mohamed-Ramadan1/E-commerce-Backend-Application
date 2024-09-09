// system imports
import { NextFunction, Response } from "express";
import crypto from "crypto";
// external modules imports
import validator from "validator";

// models imports
import User from "../../models/user/userModel";
import Shop from "../../models/shop/shopModal";

// interfaces imports
import { IShop } from "../../models/shop/shop.interface";
import {
  ShopSettingsRequest,
  VerifyShopEmailUpdating,
} from "../../RequestsInterfaces/shopRequests.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";

// Define restricted fields and error messages
const restrictedFields = {
  shopMainFields:
    "You can't update shop description, shop name, shop phone number or photo using this route. this only for updating the shop banner",

  email:
    "You can't update the shop's email using this route. Please use the route /my-shop/update-email.",
  banner:
    "You can't update the shop's banner using this route. Please use the route /my-shop/banner.",
  categories: "You can't update the shop's categories using this route.",
  owner: "You can't change the shop's owner.",
};

// check shop exist

// validate email existence on  the body and validity  of  it
const validateEmail = (email: string): boolean => {
  return !!email.trim() && validator.isEmail(email.trim());
};

// return  shop  by owner
const getShopByOwner = async (userId: string): Promise<IShop> => {
  const shop = await Shop.findOne({ owner: userId });
  if (!shop) {
    throw new AppError(
      "You don't have shop . you can apply for shop request to open your own shop",
      404
    );
  }

  // check if the shop is un-active
  if (!shop.isActive) {
    throw new AppError(
      "Your shop is un-activated you can't update the shop information",
      400
    );
  }

  return shop;
};

// check if the new email in use by anther shop  or  user account.
const checkEmailInUse = async (
  email: string,
  userId: string,
  shopId: string
): Promise<boolean> => {
  const [existingUser, existingShop] = await Promise.all([
    User.findOne({ email }),
    Shop.findOne({ email }),
  ]);

  // Ensure the email is not already used by another user or another shop
  const isEmailUsedByOtherUser =
    existingUser && existingUser._id.toString() !== userId;
  const isEmailUsedByOtherShop =
    existingShop && existingShop._id.toString() !== shopId;

  return !!(isEmailUsedByOtherUser || isEmailUsedByOtherShop);
};

// validate before request change the shop email address.
export const validateBeforeUpdateShopEmailAddress = catchAsync(
  async (
    req: ShopSettingsRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // validate new email send on the request
    const { email } = req.body;
    const userId = req.user._id.toString();

    if (!validateEmail(email)) {
      return next(new AppError("Please provide a valid email", 400));
    }
    // get shop by owner
    const shop = await getShopByOwner(userId);

    // check if the new email address used by anther shop or user account.
    const isEmailInUse = await checkEmailInUse(
      email,
      userId,
      shop._id.toString()
    );
    if (isEmailInUse) {
      return next(new AppError("This email is already in use.", 400));
    }

    // check if the new email is the same as the current shop email or the user email
    if (email.trim() === shop.email || email.trim() === req.user.email) {
      return next(
        new AppError(
          "New email must be different from the current shop and user email.",
          400
        )
      );
    }

    req.shop = shop;
    next();
  }
);

//Validate the token before updating the shop email address
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

// validate before update shop info
export const validateBeforeUpdateShopInfo = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const userId = req.user._id.toString();

    // get shop by owner
    const shop = await getShopByOwner(userId);

    // check if the user try to update shop-email
    if (req.body.email) {
      return next(new AppError(restrictedFields.email, 400));
    }
    // check if the user try to update shop-banner
    if (req.body.banner) {
      return next(new AppError(restrictedFields.banner, 400));
    }
    // check if the user try to update shop-categories
    if (req.body.categories) {
      return next(new AppError(restrictedFields.categories, 400));
    }

    // check if the user try to update shop-owner
    if (req.body.owner) {
      return next(new AppError(restrictedFields.owner, 400));
    }

    // add the shop to the request
    req.shop = shop;

    next();
  }
);

// validate before update the shop banner
export const validateBeforeUpdateBanner = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const { shopDescription, shopName, shopPhoneNumber, photo } = req.body;
    if (shopDescription || shopName || shopPhoneNumber || photo) {
      return next(new AppError(restrictedFields.shopMainFields, 400));
    }

    // check if the user try to update shop-email
    if (req.body.email) {
      return next(new AppError(restrictedFields.email, 400));
    }

    // check if the user try to update shop-categories
    if (req.body.categories) {
      return next(new AppError(restrictedFields.categories, 400));
    }

    // check if the user try to update shop-owner
    if (req.body.owner) {
      return next(new AppError(restrictedFields.owner, 400));
    }

    const userId = req.user._id.toString();
    // get shop by owner
    const shop = await getShopByOwner(userId);

    // add the shop to the request
    req.shop = shop;

    next();
  }
);
