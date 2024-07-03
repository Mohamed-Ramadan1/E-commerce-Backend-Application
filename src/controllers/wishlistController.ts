// system imports
import { NextFunction, Response } from "express";

// models imports
import Wishlist from "../models/wishlistModel";

// interface imports
import { IWishlistItem } from "../models/wishlist.interface";
import { AuthUserRequest } from "../shared-interfaces/request.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

export const getWishlist = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const wishlist: IWishlistItem[] | null = await Wishlist.find({
      user: req.user._id,
    });
    const response: ApiResponse<IWishlistItem[]> = {
      status: "success",
      results: wishlist.length,
      data: wishlist,
    };
    sendResponse(200, response, res);
  }
);

export const addItemToWishlist = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const existWishlistItem: IWishlistItem | null = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });
    if (existWishlistItem) {
      return next(new AppError("Item already on the wishlist", 400));
    }

    const wishlistItem: IWishlistItem = await Wishlist.create({
      user: req.user._id,
      product: req.params.productId,
    });
    if (!wishlistItem) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<IWishlistItem> = {
      status: "success",
      results: 1,
      data: wishlistItem,
    };
    sendResponse(200, response, res);
  }
);

export const removeItemFromWishlist = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const wishlistItem: IWishlistItem | null = await Wishlist.findOneAndDelete({
      user: req.user._id,
      __id: req.params.productId,
    });

    if (!wishlistItem) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);

export const clearWishlist = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const wishlistItem = await Wishlist.deleteMany({
      user: req.user._id,
    });
    if (!wishlistItem) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);
