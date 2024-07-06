// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { ShopSettingsRequest } from "../shared-interfaces/request.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
// emails imports
import changeShopEmailAddressConfirmationEmail from "../emails/shop/changeShopEmailAddressConfirmationEmail";

/* 
TODO: update the data of the shop.

// TODO: change the email of the shop  .
TODO: verify the email of the shop.
TODO: resend the verification email.
TODO: send a request to close the shop.
TODO: Activate the shop.
TODO: Deactivate the shop.
TODO: Delete the shop request.

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
  async (req: Request, res: Response, next: NextFunction) => {
    // recive the token
    // validate it
    //if failed send failed email update message confirmation and reseet all update related data on the collection
    //if success update the email and send confimration email with update to the both user email and the new shop email
    // send the success response
  }
);

// reset shop email to default email address (user email)
export const resetShopEmailAddressToDefault = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// get my shop
export const getMyShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const activateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deactivateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteShopRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
