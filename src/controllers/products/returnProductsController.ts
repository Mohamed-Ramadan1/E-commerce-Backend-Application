import { NextFunction, Response } from "express";
import mongoose from "mongoose";

// models imports
import ReturnProduct from "../../models/returnProduct/returnProductsModel";
import RefundRequest from "../../models/refundRequest/refundModel";
import Shop from "../../models/shop/shopModal";
// interface imports
import {
  IReturnRequest,
  ReturnStatus,
  ReceivedItemsStatus,
} from "../../models/returnProduct/returnProducts.interface";
import { IRefundRequest } from "../../models/refundRequest/refund.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { ReturnItemsRequest } from "../../shared-interfaces/returnItemRequestReq.interface";
import { IUser } from "../../models/user/user.interface";
import { ProductSourceType } from "../../models/product/product.interface";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { IShop } from "../../models/shop/shop.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

//emails imports
import refundRequestForReturnedItemsEmail from "../../emails/users/refundRequestForReturnedItemsEmail";
import returnProductRequestCreation from "../../emails/users/returnProductRequestCreation";
import returnProductRequestCancellationEmail from "../../emails/users/returnProductRequestCancellationEmail";
import returnProductRequestRejectEmail from "../../emails/users/returnProductRequestRejectEmail";
import shopReturnProductNotificationEmail from "../../emails/shop/shopOrdersManagment/shopReturnProductNotificationEmail";
import shopRefundRequestAlert from "../../emails/shop/shopOrdersManagment/shopRefundRequestAlert";
import rejectReturnProductShopAlert from "../../emails/shop/shopOrdersManagment/rejectReturnProductShopAlert";
// ----------------------------------------------------------------
//Users Operations

// create return product request
export const requestReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // orderId   ProductId  quantity   reason
    const { orderId, quantity, returnReason } = req.body;
    const user: IUser = req.user;

    const returnedItem: ICartItem = req.returnedProduct;

    const returnProductRequest: IReturnRequest | null =
      await ReturnProduct.create({
        user: user._id,
        order: orderId,
        product: returnedItem.product,
        quantity: quantity,
        returnReason: returnReason,
        refundAmount: returnedItem.priceAfterDiscount,
      });

    if (!returnProductRequest) {
      return next(new AppError("Something went wrong please tray agin.", 400));
    }
    if (returnProductRequest.product.sourceType === ProductSourceType.Shop) {
      // send email to the shop owner to inform him about the return request
      const shopProductOwner: IShop | null = await Shop.findById(
        returnProductRequest.product.shopId
      );
      if (shopProductOwner) {
        shopReturnProductNotificationEmail(
          shopProductOwner,
          returnProductRequest
        );
      }
    }

    // send email to the user to inform return product creation email
    returnProductRequestCreation(user, returnProductRequest);

    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnProductRequest,
    };
    sendResponse(201, response, res);
  }
);

// cancel the request
export const cancelReturnRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null = await ReturnProduct.findById(
      id
    );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    if (returnRequest.returnStatus !== ReturnStatus.Pending) {
      return next(
        new AppError(
          "You can't cancel this request only pending cancellation requests can be cancelled.",
          400
        )
      );
    }

    // send email to notify the user that the return request has been cancelled
    returnProductRequestCancellationEmail(req.user, returnRequest);
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };

    sendResponse(200, response, res);
  }
);

// get all user return items  requests
export const getAllMyReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      ReturnProduct.find({
        user: req.user._id,
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const returnRequests: IReturnRequest[] = await features.execute();
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

// get single return item request for the user
export const getMyReturnRequestItem = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null = await ReturnProduct.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

// delete return item request
export const deleteReturnItemRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null =
      await ReturnProduct.findByIdAndDelete({
        _id: id,
        user: req.user._id,
      });
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

// ----------------------------------------------------------------

//admin Operations

// get all return items requests
export const getAllReturnItemsRequests = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ReturnProduct.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const returnRequests: IReturnRequest[] = await features.execute();
    const response: ApiResponse<IReturnRequest[]> = {
      status: "success",
      data: returnRequests,
    };
    sendResponse(200, response, res);
  }
);

// get single return item request by id
export const getReturnItemRequest = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id)
      return next(new AppError("Invalid request provide request ID", 400));

    const returnRequest: IReturnRequest | null = await ReturnProduct.findById(
      id
    );
    if (!returnRequest) {
      return next(new AppError("No return request with this ID", 404));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };
    sendResponse(200, response, res);
  }
);

// approve item return request
export const approveReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { order, userToReturn, returnRequest } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let shop;
      const isShopProduct =
        returnRequest.product.sourceType === ProductSourceType.Shop;

      if (isShopProduct) {
        shop = (await Shop.findById(returnRequest.product.shopId).session(
          session
        )) as IShop;
      }
      // update refund request
      returnRequest.returnStatus = ReturnStatus.Approved;
      returnRequest.receivedItemsStatus = ReceivedItemsStatus.Received;
      returnRequest.processedBy = req.user._id;
      returnRequest.processedDate = new Date();
      await returnRequest.save({ session });

      const refundRequest: IRefundRequest = new RefundRequest({
        order: order._id,
        user: userToReturn._id,
        refundAmount: returnRequest.refundAmount,
        refundMethod: "giftCard",
        refundType: "return",
        refundStatus: "pending",
      });

      // if the product to be refund related to shop add the shop to the refund request
      if (isShopProduct && shop) {
        refundRequest.isRelatedToShop = true;
        refundRequest.shop = shop;
      }

      await refundRequest.save({ session });

      // Send shop owner alert if related to a shop
      if (isShopProduct && shop) {
        shopRefundRequestAlert(shop, refundRequest);
      }

      // Send email outside of transaction to prevent delays
      setImmediate(() => {
        refundRequestForReturnedItemsEmail(
          userToReturn,
          refundRequest,
          returnRequest
        );
      });

      // commit the transaction
      await session.commitTransaction();

      const response: ApiResponse<IReturnRequest> = {
        status: "success",
        data: returnRequest,
      };
      sendResponse(200, response, res);
    } catch (err: any) {
      await session.abortTransaction();
      throw new AppError(
        err.message || "Something went wrong please try again.",
        400
      );
    } finally {
      await session.endSession();
    }
  }
);

// reject item return request
export const rejectReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    const { order, userToReturn, returnRequest } = req;
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return new AppError(
        "You have to provide reason for reject return item / product request..",
        400
      );
    }
    // update refund request
    returnRequest.returnStatus = ReturnStatus.Rejected;
    returnRequest.receivedItemsStatus = ReceivedItemsStatus.Received;
    returnRequest.processedBy = req.user._id;
    returnRequest.processedDate = new Date();
    returnRequest.rejectionReason = rejectionReason;
    const savedDocument = await returnRequest.save();
    if (!savedDocument) {
      return next(
        new AppError("Something went wrong while updating return request.", 400)
      );
    }
    if (returnRequest.product.sourceType === ProductSourceType.Shop) {
      const shop = await Shop.findById(returnRequest.product.shopId);
      if (shop) {
        rejectReturnProductShopAlert(shop, returnRequest);
      }
    }
    // email with rejecting information to the user
    returnProductRequestRejectEmail(userToReturn, returnRequest);

    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnRequest,
    };

    sendResponse(200, response, res);
  }
);
