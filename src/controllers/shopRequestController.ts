//system imports
import { NextFunction, Response } from "express";

//models imports
import ShopRequest from "../models/shopRequestModal";
import User from "../models/userModel";
import Shop from "../models/shopModal";
import ProcessedCreateShopRequests from "../models/processedCreateShopRequestsModal";

// interface imports
import { IShopRequest } from "../models/shopRequest.interface";
import { ShopRequestReq } from "../shared-interfaces/request.interface";
import { IShop } from "../models/shop.interface";
import { IProcessedShopRequest } from "../models/processedCreateShopRequests.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";
// email imports
import receiveShopRequestConfirmationEmail from "../emails/shop/receiveShopRequestConfirmationEmail";
import shopRequestCanceledEmail from "../emails/shop/cancelShopRequestConfirmationEmail";
import rejectShopRequestConfirmationEmail from "../emails/shop/rejectShopRequestConfirmationEmail";
import approveShopRequestConfirmationEmail from "../emails/shop/approveShopRequestConfirmationEmail";
import { IUser } from "../models/user.interface";

/*
TODO: implement the processed create shop request is not completed 
TODO: fix the related problem withe the processed create shop request .
//TODO: create a new shop request 
//TODO: get all pending shop requests
//TODO: get a single shop request
//TODO: update a shop request
//TODO: delete a shop request
//TODO: confirm a shop request / approve a shop request
//TODO: reject a shop request / decline a shop request
//TODO: Cancel a shop request


  //TODO: send approved request email
 //TODO: send Cancel request email
 //TODO: send rejected request email
*/

//--------------------------------------
// user options
export const cancelShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const shopRequest: IShopRequest | null = await ShopRequest.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!shopRequest) {
      return next(new AppError("No shop request found", 404));
    }
    if (shopRequest.requestStatus === "cancelled") {
      return next(new AppError("Shop request is already cancelled", 400));
    }
    if (
      shopRequest.requestStatus === "approved" ||
      shopRequest.requestStatus === "rejected"
    ) {
      return next(
        new AppError(
          "Cannot cancel a shop request that is already approved or rejected",
          400
        )
      );
    }

    shopRequest.requestStatus = "cancelled";
    await shopRequest.save();

    // send cancel request email confirmation
    shopRequestCanceledEmail(req.user, shopRequest);

    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request cancelled successfully.",
      data: shopRequest,
    };
    sendResponse(200, response, res);
  }
);

//--------------------------------------
// admin options

export const createShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const { shopDescription } = req.body;
    const user = req.user;

    const shopRequest: IShopRequest = await ShopRequest.create({
      shopDescription,
      user: user._id,
    });
    receiveShopRequestConfirmationEmail(user, shopRequest);
    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request created successfully.",
      data: shopRequest,
    };
    sendResponse(201, response, res);
  }
);

export const getAllPendingShopsRequests = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const shopRequests: IShopRequest[] = await ShopRequest.find({
      requestStatus: "pending",
    });
    const response: ApiResponse<IShopRequest[]> = {
      status: "success",
      results: shopRequests.length,
      data: shopRequests,
    };
    sendResponse(200, response, res);
  }
);
export const getShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const shopRequest: IShopRequest | null = await ShopRequest.findById(
      req.params.id
    );
    if (!shopRequest) {
      return next(new AppError("Shop request not found", 404));
    }
    const response: ApiResponse<IShopRequest> = {
      status: "success",
      data: shopRequest,
    };
    sendResponse(200, response, res);
  }
);
export const updateShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const shopRequest: IShopRequest | null =
      await ShopRequest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    if (!shopRequest) {
      return next(new AppError("Shop request not found", 404));
    }
    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request updated successfully.",
      data: shopRequest,
    };
    sendResponse(200, response, res);
  }
);

export const deleteShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const shopRequest: IShopRequest | null =
      await ShopRequest.findByIdAndDelete(req.params.id);
    if (!shopRequest) {
      return next(new AppError("Shop request not found", 404));
    }
    const response: ApiResponse<IShopRequest | null> = {
      status: "success",
      message: "Shop request deleted successfully.",
      data: null,
    };
    sendResponse(204, response, res);
  }
);

export const confirmShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    // extract the user and the shop request from the request
    const { userToOpenShop, shopRequest } = req;

    // create object data contains the default dat of the shop
    const shopDataObject: object = {
      owner: userToOpenShop._id,
      email: userToOpenShop.email,
      phone: userToOpenShop.phoneNumber,
      shopName: userToOpenShop.name,
      shopDescription: shopRequest.shopDescription || "",
    };

    // create the shop
    const shop: IShop = await Shop.create(shopDataObject);

    // assign the shop to the user
    userToOpenShop.myShop = shop._id;
    await userToOpenShop.save({ validateBeforeSave: false });

    // update the shop data to approve and define who approved it.
    shopRequest.requestStatus = "approved";
    shopRequest.processedBy = req.user._id;
    shopRequest.processedAt = new Date();
    await shopRequest.save({ validateBeforeSave: false });

    // send confirmation email to tell the user his shop has been created successfully
    approveShopRequestConfirmationEmail(userToOpenShop, shop);

    // create process document to save the data
    const processedShopRequest: IProcessedShopRequest =
      await ProcessedCreateShopRequests.create({
        user: {
          name: userToOpenShop.name,
          email: userToOpenShop.email,
          phoneNumber: userToOpenShop.phoneNumber,
          _id: userToOpenShop._id,
          role: userToOpenShop.role,
        },
        shopDescription: shopRequest.shopDescription,
        requestStatus: "approved",
        processedBy: {
          name: req.user.name,
          email: req.user.email,
          phoneNumber: req.user.phoneNumber,
          _id: req.user._id,
          role: req.user.role,
        },
        processedDate: new Date(),
        requestCreatedDate: shopRequest.createdAt,
        requestLastUpdatedDate: shopRequest.updatedAt,
      });
    //delete the shop request
    await ShopRequest.findByIdAndDelete(shopRequest._id);

    //create json response
    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request approved successfully.",
      data: shopRequest,
    };

    // send the response to the client.
    sendResponse(200, response, res);
  }
);

export const rejectShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    //reject the request and send reject email to the user
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return next(new AppError("Please provide a rejection reason", 400));
    }
    const shopRequest: IShopRequest | null = await ShopRequest.findById(
      req.params.id
    );

    if (!shopRequest) {
      return next(new AppError("Shop request not found", 404));
    }
    const userToOpenShop = (await User.findById(shopRequest.user)) as IUser;

    if (shopRequest.requestStatus === "rejected") {
      return next(new AppError("Shop request is already rejected", 400));
    }
    shopRequest.requestStatus = "rejected";
    shopRequest.processedBy = req.user._id;
    shopRequest.processedAt = new Date();
    await shopRequest.save();

    rejectShopRequestConfirmationEmail(req.user, shopRequest, rejectionReason);

    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request rejected successfully.",
      data: shopRequest,
    };
    sendResponse(200, response, res);
  }
);
