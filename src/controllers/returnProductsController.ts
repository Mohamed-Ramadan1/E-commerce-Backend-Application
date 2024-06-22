import ReturnProduct from "../models/returnProductsModel";
import Order from "../models/orderModel";
import Product from "../models/productModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { IReturnRequest } from "../models/returnProducts.interface";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import {
  AuthUserRequest,
  ReturnItemsRequest,
} from "../shared-interfaces/request.interface";
import { ICartItem } from "../models/cartItem.interface";
import { IUser } from "../models/user.interface";

// ----------------------------------------------------------------
//Users Operations
export const requestReturnItems = catchAsync(
  async (req: ReturnItemsRequest, res: Response, next: NextFunction) => {
    // orderId   ProductId  quantity   reason
    /*
    get the order from the order model and check if the order belongs to the user
    get the product from the product model and check if the product exists
    check if the product is in the order
    check if the product is not already returned
    check the product is purchased within the last 30 days
    create a return request
    */
    const { orderId, quantity, returnReason } = req.body;
    const returnedItem: any = req.returnedProduct;
    const refundAmount: number = returnedItem.product.price * quantity;
    const user: IUser = req.user;
    const returnProductRequest: IReturnRequest | null =
      await ReturnProduct.create({
        user: user._id,
        order: orderId,
        product: returnedItem.product,
        quantity: quantity,
        returnReason: returnReason,
        refundAmount: refundAmount,
      });
    if (!returnProductRequest) {
      return next(new AppError("Something went wrong", 400));
    }
    const response: ApiResponse<IReturnRequest> = {
      status: "success",
      data: returnProductRequest,
    };
    sendResponse(201, response, res);
  }
);

export const cancelReturnRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const getAllMyReturnItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getMyReturnRequestItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateReturnItemRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const deleteReturnItemRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// ----------------------------------------------------------------

//admin Operations
export const getAllReturnItemsRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getReturnItemRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const approveReturnItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const rejectReturnItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
