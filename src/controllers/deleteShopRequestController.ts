// system imports
import { Response, NextFunction } from "express";

// models imports
import DeleteShopRequest from "../models/deleteShopRequestModal";
import ProcessedDeleteShopRequest from "../models/processedDeleteShopRequestModal";
import Shop from "../models/shopModal";

// interface imports
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import { IProcessedDeletedShopRequest } from "../models/processedDeleteShopRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { DeleteShopRequestReq } from "../shared-interfaces/deleteShopRequestReq.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

//emails imports
import deleteShopRequestSuccessConfirmationEmail from "../emails/shop/deleteShopRequestSuccessConfirmationEmail";
import deleteShopRequestCancellationEmail from "../emails/shop/deleteShopRequestCancellationEmail";
import deleteShopRequestRejectionEmail from "../emails/shop/deleteShopRequestRejectionEmail";

export const getAllDeleteShopRequests = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const deleteShopRequests: IDeleteShopRequest[] =
      await DeleteShopRequest.find();

    const response: ApiResponse<IDeleteShopRequest[]> = {
      status: "success",
      data: deleteShopRequests,
    };
    sendResponse(200, response, res);
  }
);

export const getDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findById(req.params.id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(200, response, res);
  }
);

//create a new delete shop request
export const createDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { userId, shopId, reason } = req.body;
    const deleteShopRequest: IDeleteShopRequest =
      await DeleteShopRequest.create({
        user: userId,
        shop: shopId,
        reason,
      });

    if (!deleteShopRequest) {
      return next(new AppError("Something went wrong", 400));
    }
    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(201, response, res);
  }
);

export const updateDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<IDeleteShopRequest> = {
      status: "success",
      data: deleteShopRequest,
    };
    sendResponse(200, response, res);
  }
);

export const deleteDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findByIdAndDelete(req.params.id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

// TODO: All product related to this shop should be deleted if the request approved
export const approveDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopOwner, deleteShopRequest, shop } = req;
    // approve the delete shop request
    deleteShopRequest.requestStatus = "approved";
    deleteShopRequest.processedBy = req.user._id;
    await deleteShopRequest.save({ validateBeforeSave: false });
    // create a processed delete shop request
    const processedDeletedRequestObject: object = {
      user: {
        name: shopOwner.name,
        email: shopOwner.email,
        phoneNumber: shopOwner.phoneNumber,
      },
      shop: {
        shopName: shop.shopName,
        email: shop.email,
        phone: shop.phone,
      },
      processedBy: {
        name: req.user.name,
        email: req.user.email,
      },
      reason: deleteShopRequest.reason,
      processedAt: new Date(),
      requestStatus: deleteShopRequest.requestStatus,
    };
    const processedDeletedRequest: IProcessedDeletedShopRequest =
      await ProcessedDeleteShopRequest.create(processedDeletedRequestObject);
    // delete the shop
    await Shop.findByIdAndDelete(shop._id);
    //delete deleteShopRequest
    await DeleteShopRequest.findByIdAndDelete(deleteShopRequest._id);
    // TODO: delete all products related to this shop

    // update user shop reference
    shopOwner.myShop = undefined;
    await shopOwner.save({ validateBeforeSave: false });
    // send confirmation email to the shop owner
    deleteShopRequestSuccessConfirmationEmail(
      shopOwner,
      shop,
      deleteShopRequest
    );
    // send response
    const response: ApiResponse<null> = {
      status: "success",
      message: "Shop deleted successfully.",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

export const rejectDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopOwner, deleteShopRequest, shop } = req;
    // approve the delete shop request
    deleteShopRequest.requestStatus = "rejected";
    deleteShopRequest.processedBy = req.user._id;
    await deleteShopRequest.save({ validateBeforeSave: false });
    // create a processed delete shop request
    const processedDeletedRequestObject: object = {
      user: {
        name: shopOwner.name,
        email: shopOwner.email,
        phoneNumber: shopOwner.phoneNumber,
      },
      shop: {
        shopName: shop.shopName,
        email: shop.email,
        phone: shop.phone,
      },
      processedBy: {
        name: req.user.name,
        email: req.user.email,
      },
      reason: deleteShopRequest.reason,
      processedAt: new Date(),
      requestStatus: deleteShopRequest.requestStatus,
    };
    const processedDeletedRequest: IProcessedDeletedShopRequest =
      await ProcessedDeleteShopRequest.create(processedDeletedRequestObject);
    //delete deleteShopRequest
    await DeleteShopRequest.findByIdAndDelete(deleteShopRequest._id);

    // send confirmation email to the shop owner
    deleteShopRequestRejectionEmail(shopOwner, shop, deleteShopRequest);
    // send response
    const response: ApiResponse<null> = {
      status: "success",
      message:
        "Shop deleted request rejected contact shops support for more data.",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

export const cancelDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopOwner, deleteShopRequest, shop } = req;
    // approve the delete shop request
    deleteShopRequest.requestStatus = "cancelled";
    deleteShopRequest.processedBy = req.user._id;
    await deleteShopRequest.save({ validateBeforeSave: false });
    // create a processed delete shop request
    const processedDeletedRequestObject: object = {
      user: {
        name: shopOwner.name,
        email: shopOwner.email,
        phoneNumber: shopOwner.phoneNumber,
      },
      shop: {
        shopName: shop.shopName,
        email: shop.email,
        phone: shop.phone,
      },
      processedBy: {
        name: req.user.name,
        email: req.user.email,
      },
      reason: deleteShopRequest.reason,
      processedAt: new Date(),
      requestStatus: deleteShopRequest.requestStatus,
    };
    const processedDeletedRequest: IProcessedDeletedShopRequest =
      await ProcessedDeleteShopRequest.create(processedDeletedRequestObject);
    //delete deleteShopRequest
    await DeleteShopRequest.findByIdAndDelete(deleteShopRequest._id);

    // send confirmation email to the shop owner
    deleteShopRequestCancellationEmail(shopOwner, shop, deleteShopRequest);
    // send response
    const response: ApiResponse<null> = {
      status: "success",
      message:
        "Shop deleted request canceled successfully if you have more question contact shops support.",
      data: null,
    };
    sendResponse(200, response, res);
  }
);
