//system imports
import { NextFunction, Response } from "express";

//models imports
import ShopRequest from "../../models/newShopRequest/shopRequestModal";
import Shop from "../../models/shop/shopModal";
import ProcessedCreateShopRequests from "../../models/processedData/processedCreateShopRequestsModal";

// interface imports
import {
  IShopRequest,
  RequestStatus,
} from "../../models/newShopRequest/shopRequest.interface";
import { ShopRequestReq } from "../../shared-interfaces/shopRequests.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

// email imports
import receiveShopRequestConfirmationEmail from "../../emails/shop/receiveShopRequestConfirmationEmail";
import shopRequestCanceledEmail from "../../emails/shop/cancelShopRequestConfirmationEmail";
import rejectShopRequestConfirmationEmail from "../../emails/shop/rejectShopRequestConfirmationEmail";
import approveShopRequestConfirmationEmail from "../../emails/shop/approveShopRequestConfirmationEmail";

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
  shopRequestStatus: RequestStatus,
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

    await updateAndSaveShopRequestDocument(
      RequestStatus.Cancelled,
      shopRequest,
      req.user
    );

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

// get all shop requests
export const getAllShopRequests = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const apiFeatures = new APIFeatures(ShopRequest.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const shopRequests: IShopRequest[] = await apiFeatures.execute();
    const response: ApiResponse<IShopRequest[]> = {
      status: "success",
      results: shopRequests.length,
      data: shopRequests,
    };
    sendResponse(200, response, res);
  }
);

// get shop request by id
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

// update shop request
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

// delete shop request
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

// confirm shop request
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
    userToOpenShop.myShop = shop;
    await userToOpenShop.save({ validateBeforeSave: false });

    // update the shop request data  and save it.
    await updateAndSaveShopRequestDocument(
      RequestStatus.Approved,
      shopRequest,
      req.user
    );

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

// reject the request
export const rejectShopRequest = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    //extract required parameters from the request object.
    const { rejectionReason } = req.body;
    const { shopRequest, userToOpenShop } = req;

    // update the shop request data  and save it.
    await updateAndSaveShopRequestDocument(
      RequestStatus.Rejected,
      shopRequest,
      req.user
    );

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
