// system imports
import { NextFunction, Response } from "express";
import { promises as fs } from "fs";
// external modules imports
import cloudinary from "cloudinary";

// models imports
import Shop from "../models/shopModal";
import DeleteShopRequest from "../models/deleteShopRequestModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import {
  ShopSettingsRequest,
  VerifyShopEmailUpdating,
} from "../shared-interfaces/shopRequests.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

// emails imports
import changeShopEmailAddressConfirmationEmail from "../emails/shop/changeShopEmailAddressConfirmationEmail";
import sendWelcomeEmailToNewShopEmailAddress from "../emails/shop/sendWelcomeEmailToNewShopEmailAddress";
import successShopEmailUpdateConfirmation from "../emails/shop/successShopEmailUpdateConfirmation";
import resetShopEmailAddressToDefaultEmail from "../emails/shop/resetShopEmailAddressToDefaultEmail";
import deleteShopRequestReceivedConfirmationEmail from "../emails/shop/deleteShopRequestReceivedConfirmationEmail";

type UpdateObject = {
  shopName?: string;
  description?: string;
  phoneNumber?: string;
  photo?: string;
  photoPublicId?: string;
};

// Update shop data (Shop name, description, phone number, photo)
export const updateShopInformation = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    /* 
      update shopName 
      update shopDescription
      update shop phoneNumber
      update shop photo
      */
    const shop = req.shop;
    const { shopName, shopDescription, shopPhoneNumber, photo } = req.body;
    console.log(req.body);
    const updateObject: UpdateObject = {};
    if (shopName) updateObject.shopName = shopName;
    if (shopDescription) updateObject.description = shopDescription;
    if (shopPhoneNumber) updateObject.phoneNumber = shopPhoneNumber;

    // if there file photo for the shop upload to the cloudinary and add it to the update object
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      updateObject.photo = response.secure_url;
      updateObject.photoPublicId = response.public_id;
    }

    const updatedObject = (await Shop.findByIdAndUpdate(
      shop._id,
      updateObject,
      {
        new: true,
      }
    )) as IShop;
    // create response object
    const response: ApiResponse<IShop> = {
      status: "success",
      message: "Shop information updated successfully.",
      data: updatedObject,
    };
    sendResponse(200, response, res);
  }
);

// update shop banner image.
export const updateShopBanner = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    // update the shop banner
    const shop = req.shop;
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      shop.banner = response.secure_url;
      shop.bannerId = response.public_id;
      await shop.save();
    }
    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop banner updated successfully.",
    };
    sendResponse(200, response, res);
  }
);

// change emails
export const updateShopEmailAddress = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    // get the new email form the request
    const { email } = req.body;
    const { shop } = req;
    const user = req.user as IUser;

    // generate the token
    const verificationToken: string = shop.createChangeEmailVerificationToken();
    changeShopEmailAddressConfirmationEmail(
      user,
      shop,
      verificationToken,
      email
    );

    // set the tempChange Email
    shop.tempChangedEmail = email;
    // save the shop
    await shop.save({ validateBeforeSave: false });

    //send response
    const response: ApiResponse<null> = {
      status: "success",
      message:
        "Shop email verification email successfully sent, check your email to confirm the email change",
    };
    sendResponse(200, response, res);
  }
);

// verify changeEmail
export const verifyChangedShopEMail = catchAsync(
  async (req: VerifyShopEmailUpdating, res: Response, next: NextFunction) => {
    const { user, shop } = req;

    const tempChangeEmail = shop.tempChangedEmail;

    if (!tempChangeEmail) {
      return next(
        new AppError(
          "something went wrong pleas tray again to request shop email change.",
          404
        )
      );
    }
    // send the confirmation email

    shop.email = tempChangeEmail;
    shop.tempChangedEmail = undefined;
    shop.changeEmailVerificationToken = undefined;
    shop.changeEmailVerificationTokenExpiresAt = undefined;
    await shop.save({ validateBeforeSave: false });

    // send confirmation email to the old email
    successShopEmailUpdateConfirmation(user, shop);

    // send welcome email to the new email
    sendWelcomeEmailToNewShopEmailAddress(tempChangeEmail, user, shop);

    const response: ApiResponse<null> = {
      status: "success",
      message:
        "Shop email successfully updated your shop will be manged by the new email.",
    };
    sendResponse(200, response, res);
  }
);

// reset shop email to default email address (user email)
export const resetShopEmailAddressToDefault = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const shopId = req.user.myShop;
    if (!shopId) {
      return next(
        new AppError("You don't have a shop yet, please create one first.", 404)
      );
    }

    const shop = (await Shop.findById(shopId)) as IShop;

    if (shop.email === req.user.email) {
      return next(
        new AppError("Shop email is already the default email address.", 400)
      );
    }

    shop.email = req.user.email;
    await shop.save({ validateBeforeSave: false });

    // send confirmation email to the user email address
    resetShopEmailAddressToDefaultEmail(req.user, shop);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop email successfully reset to the default account  email.",
    };
    sendResponse(200, response, res);
  }
);

// get my shop
export const getMyShop = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const shopId = req.user.myShop;
    if (!shopId) {
      return next(
        new AppError("You don't have a shop yet, please create one first.", 404)
      );
    }
    const shop = (await Shop.findById(shopId)) as IShop;

    const response: ApiResponse<IShop> = {
      status: "success",
      data: shop,
    };
    sendResponse(200, response, res);
  }
);

// activate the shop
export const activateShop = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const shopId = req.user.myShop;
    if (!shopId) {
      return next(
        new AppError("You don't have a shop yet, please create one first.", 404)
      );
    }
    const shop = (await Shop.findById(shopId)) as IShop;
    if (shop.isActive) {
      return next(new AppError("Shop is already active.", 400));
    }
    shop.isActive = true;
    await shop.save({ validateBeforeSave: false });
    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop successfully activated.",
    };
    sendResponse(200, response, res);
  }
);

// un activate shop
export const deactivateShop = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const shopId = req.user.myShop;
    if (!shopId) {
      return next(
        new AppError("You don't have a shop yet, please create one first.", 404)
      );
    }
    const shop: IShop = (await Shop.findById(shopId)) as IShop;
    if (!shop.isActive) {
      return next(new AppError("Shop is already un active.", 400));
    }

    shop.isActive = false;
    await shop.save({ validateBeforeSave: false });
    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop un activated successfully.",
    };
    sendResponse(200, response, res);
  }
);

// apply for shop delete request
export const deleteShopRequest = catchAsync(
  async (req: ShopSettingsRequest, res: Response, next: NextFunction) => {
    const reason = req.body.reason;
    const user = req.user;
    const shopId = req.user.myShop;
    if (!reason) {
      return next(
        new AppError("Please provide a reason for deleting the shop.", 400)
      );
    }

    // get shopping based on the shopping id
    const shop = (await Shop.findById(shopId)) as IShop;

    if (!shop) {
      return next(
        new AppError("You don't have a shop yet, please create one first.", 404)
      );
    }
    const existDeleteRequest = await DeleteShopRequest.findOne({
      shop: shop._id,
    });
    if (existDeleteRequest) {
      return next(
        new AppError(
          "Delete shop request for this shop already created please wait until your request processed.",
          400
        )
      );
    }
    //create the delete request
    const deleteRequest: IDeleteShopRequest = await DeleteShopRequest.create({
      user: user._id,
      shop: shop._id,
      reason,
    });

    shop.isActive = false;
    await shop.save({ validateBeforeSave: false });
    // send a confirmation email to the shop owner
    deleteShopRequestReceivedConfirmationEmail(user, shop, deleteRequest);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop request successfully sent for deletion.",
    };
    sendResponse(200, response, res);
  }
);
