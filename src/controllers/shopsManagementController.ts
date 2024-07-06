// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";
import { IProduct } from "../models/product.interface";

/*
//TODO: get all shops .
//TODO: get shop .
//TODO: delete shop .
//TODO: update shop .

//TODO: un-active shop.
//TODO: activate shop.

TODO:  get all products in the shop. 
TODO:  get a single product in the shop.
TODO:  freezing product in the shop.
TODO:  un-freezing product in the shop.

TODO: get all orders created on the shop.
TODO: get a single order created on the shop.

*/

// get all shops.
export const getAllShops = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const shops: IShop[] = await Shop.find();
    const response: ApiResponse<IShop[]> = {
      status: "success",
      results: shops.length,
      data: shops,
    };
    sendResponse(200, response, res);
  }
);

export const getShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findById(id);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const response: ApiResponse<IShop> = {
      status: "success",
      data: shop,
    };
    sendResponse(200, response, res);
  }
);

export const deleteShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const user: IUser | null = await User.findById(shop.owner);
    if (user) {
      user.myShop = undefined;
      await user.save();
    }
    const response: ApiResponse<IShop> = {
      status: "success",
      message: "Shop deleted successfully.",
    };
    sendResponse(204, response, res);
  }
);

export const updateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const response: ApiResponse<IShop> = {
      status: "success",
      data: shop,
    };
    sendResponse(200, response, res);
  }
);

export const activateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findById(id);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    if (shop.isActive) {
      return next(new AppError("Shop is already active.", 400));
    }
    shop.isActive = true;
    await shop.save();
    const response: ApiResponse<IShop> = {
      status: "success",
      message: "Shop activated successfully.",
      data: shop,
    };
    sendResponse(200, response, res);
  }
);

export const unActiveShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findById(id);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    if (!shop.isActive) {
      return next(new AppError("Shop is already un-active.", 400));
    }
    shop.isActive = false;
    await shop.save();
    const response: ApiResponse<IShop> = {
      status: "success",
      message: "Shop un-activated successfully.",
      data: shop,
    };
    sendResponse(200, response, res);
  }
);

export const getAllProductsInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const shop: IShop | null = await Shop.findById(id);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const products: IProduct[] | any = shop.products || [];

    const response: ApiResponse<IProduct[]> = {
      status: "success",
      results: products.length,
      data: products,
    };
    sendResponse(200, response, res);
  }
);

export const getSingleProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const freezingProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const unfreezingProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
