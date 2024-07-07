// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";
import DeleteShopRequest from "../models/deleteShopRequestModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import {
  ShopSettingsRequest,
  VerifyShopEmailUpdating,
} from "../shared-interfaces/request.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import AppError from "../utils/ApplicationError";

// emails imports
import changeShopEmailAddressConfirmationEmail from "../emails/shop/changeShopEmailAddressConfirmationEmail";
import sendWelcomeEmailToNewShopEmailAddress from "../emails/shop/sendWelcomeEmailToNewShopEmailAddress";
import successShopEmailUpdateConfirmation from "../emails/shop/successShopEmailUpdateConfirmation";
import resetShopEmailAddressToDefaultEmail from "../emails/shop/resetShopEmailAddressToDefaultEmail";
import deleteShopRequestReceivedConfirmationEmail from "../emails/shop/deleteShopRequestReceivedConfirmationEmail";
/* 
TODO: update the data of the shop.

// TODO: change the email of the shop  .
//TODO: verify the email of the shop.
//TODO: reset the email of the shop to the default email.

//TODO: get my shop

//TODO: Activate the shop.
//TODO: Deactivate the shop.
//TODO: Delete the shop request.

*/

export const updateShopInformation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    /* 
      update shopName 
      update shopDescription
      update shop phoneNumber
      update categories
  
      ! photo and banners are related with multi file uploads
      update photo 
      update banner
    
      */
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
