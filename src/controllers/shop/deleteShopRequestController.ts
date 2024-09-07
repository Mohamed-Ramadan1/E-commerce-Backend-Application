// system imports
import { Response, NextFunction } from "express";
import mongoose from "mongoose";

// models imports
import DeleteShopRequest from "../../models/deleteShopRequest/deleteShopRequestModal";
import ProcessedDeleteShopRequest from "../../models/processedData/processedDeleteShopRequestModal";
import Shop from "../../models/shop/shopModal";

// interface imports
import {
  IDeleteShopRequest,
  RequestStatus,
} from "../../models/deleteShopRequest/deleteShopRequest.interface";
import { IProcessedDeletedShopRequest } from "../../models/processedData/processedDeleteShopRequest.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { DeleteShopRequestReq } from "../../shared-interfaces/deleteShopRequestReq.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { cascadeShopDeletion } from "../../utils/shopUtils/deleteShopRelatedData";

//emails imports
import deleteShopRequestSuccessConfirmationEmail from "../../emails/shop/deleteShopRequestSuccessConfirmationEmail";
import deleteShopRequestCancellationEmail from "../../emails/shop/deleteShopRequestCancellationEmail";
import deleteShopRequestRejectionEmail from "../../emails/shop/deleteShopRequestRejectionEmail";

// get all delete shop requests
export const getAllDeleteShopRequests = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const features = new APIFeatures(DeleteShopRequest.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const deleteShopRequests: IDeleteShopRequest[] = await features.execute();

    const response: ApiResponse<IDeleteShopRequest[]> = {
      status: "success",
      data: deleteShopRequests,
    };
    sendResponse(200, response, res);
  }
);

// get a single delete shop request
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

// update delete shop request
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

// delete delete-shop request
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

// approve shop deleting request.
export const approveDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { shopOwner, deleteShopRequest, shop } = req;

      // Approve the delete shop request
      deleteShopRequest.requestStatus = RequestStatus.Approved;
      deleteShopRequest.processedBy = req.user;
      await deleteShopRequest.save({ session, validateBeforeSave: false });

      // Create a processed delete shop request
      const processedDeletedRequestObject = {
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
      await ProcessedDeleteShopRequest.create([processedDeletedRequestObject], {
        session,
      });

      // Delete the shop
      await Shop.findByIdAndDelete(shop._id).session(session);

      // Delete deleteShopRequest
      await DeleteShopRequest.findByIdAndDelete(deleteShopRequest._id).session(
        session
      );

      // Delete all products related to this shop
      await cascadeShopDeletion(shop, session, next);

      // Update user shop reference
      shopOwner.myShop = undefined;
      await shopOwner.save({ session, validateBeforeSave: false });

      await session.commitTransaction();

      // Send confirmation email to the shop owner
      await deleteShopRequestSuccessConfirmationEmail(
        shopOwner,
        shop,
        deleteShopRequest
      );

      const response: ApiResponse<null> = {
        status: "success",
        message: "Shop deleted successfully.",
        data: null,
      };
      sendResponse(200, response, res);
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError("Error occurred during shop deletion approval", 500);
      }
    } finally {
      session.endSession();
    }
  }
);

// reject shop deleting request
export const rejectDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopOwner, deleteShopRequest, shop } = req;
    // approve the delete shop request
    deleteShopRequest.requestStatus = RequestStatus.Rejected;
    deleteShopRequest.processedBy = req.user;
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

// cancel the shop deleting request
export const cancelDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopOwner, deleteShopRequest, shop } = req;
    // approve the delete shop request
    deleteShopRequest.requestStatus = RequestStatus.Cancelled;
    deleteShopRequest.processedBy = req.user;
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
