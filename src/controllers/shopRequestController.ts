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
//TODO: implement the processed create shop request is not completed 
//TODO: fix the related problem withe the processed create shop request .
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

//-----------------
// Helper functions
const createShopObject = (user: IUser, shopRequest: IShopRequest) => {
  // create object data contains the default dat of the shop
  const shopDataObject: object = {
    owner: user._id,
    email: user.email,
    phone: user.phoneNumber,
    shopName: user.name,
    shopDescription: shopRequest.shopDescription || "",
  };
  return shopDataObject;
};

const createProcessedShopRequest = async (
  user: IUser,
  shopRequest: IShopRequest,
  processedBy: IUser,
  requestStatus: string
) => {
  const processedRequest = await ProcessedCreateShopRequests.create({
    user: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      _id: user._id,
      role: user.role,
    },
    shopDescription: shopRequest.shopDescription,
    requestStatus: requestStatus,
    processedBy: {
      name: processedBy.name,
      email: processedBy.email,
      phoneNumber: processedBy.phoneNumber,
      _id: processedBy._id,
      role: processedBy.role,
    },
    processedDate: new Date(),
    requestCreatedDate: shopRequest.createdAt,
    requestLastUpdatedDate: shopRequest.updatedAt,
  });
  if (!processedRequest) {
    return;
  }
  // delete the shop request
  await ShopRequest.findByIdAndDelete(shopRequest._id);
};

const updateAndSaveShopRequestDocument = async (
  shopRequestStatus: "approved" | "rejected" | "cancelled",
  shopRequest: IShopRequest,
  processedBy: IUser
) => {
  shopRequest.requestStatus = shopRequestStatus;
  shopRequest.processedBy = processedBy._id;
  shopRequest.processedAt = new Date();
  await shopRequest.save();
};

//--------------------------------------
// user options
export const cancelShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const { shopRequest } = req;

    await updateAndSaveShopRequestDocument("cancelled", shopRequest, req.user);

    // send cancel request email confirmation
    shopRequestCanceledEmail(req.user, shopRequest);

    await createProcessedShopRequest(
      req.user,
      shopRequest,
      req.user,
      "cancelled"
    );

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

    // generate the default shop data object
    const shopDataObject: object = createShopObject(
      userToOpenShop,
      shopRequest
    );
    // create the shop
    const shop: IShop = await Shop.create(shopDataObject);

    // assign the shop to the user
    userToOpenShop.myShop = shop._id;
    await userToOpenShop.save({ validateBeforeSave: false });

    // update the shop request data  and save it.
    await updateAndSaveShopRequestDocument("approved", shopRequest, req.user);

    // send confirmation email to tell the user his shop has been created successfully
    approveShopRequestConfirmationEmail(userToOpenShop, shop);

    // create process document to save the data
    await createProcessedShopRequest(
      userToOpenShop,
      shopRequest,
      req.user,
      "approved"
    );

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
    //extract required parameters from the request object.
    const { rejectionReason } = req.body;
    const { shopRequest, userToOpenShop } = req;

    // update the shop request data  and save it.
    await updateAndSaveShopRequestDocument("rejected", shopRequest, req.user);

    // send rejection email to the user
    rejectShopRequestConfirmationEmail(
      userToOpenShop,
      shopRequest,
      rejectionReason
    );

    // create process document to save the data.
    await createProcessedShopRequest(
      userToOpenShop,
      shopRequest,
      req.user,
      "rejected"
    );

    const response: ApiResponse<IShopRequest> = {
      status: "success",
      message: "Shop request rejected successfully.",
      data: shopRequest,
    };
    sendResponse(200, response, res);
  }
);
