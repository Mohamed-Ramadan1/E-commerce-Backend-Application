// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";
import Product from "../models/productModel";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ShopsManagementRequest } from "../shared-interfaces/shopMangmentRequest.interface";
// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";
import { IProduct } from "../models/product.interface";

// TODO Complete
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
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const shops: IShop[] = await Shop.find();
    const response: ApiResponse<IShop[]> = {
      status: "success",
      results: shops.length,
      data: shops,
    };
    sendResponse(200, response, res);
  }
);

// get shop
export const getShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
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

// delete shop
export const deleteShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findByIdAndDelete(shopId);
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

// update shop
export const updateShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findByIdAndUpdate(shopId, req.body, {
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
// activate shop
export const activateShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
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

// un-active shop
export const unActiveShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
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

// get all products on the shop
export const getAllProductsInShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const products: IProduct[] = await Product.find({
      sourceType: "shop",
      shopId: shop._id,
    });

    const response: ApiResponse<IProduct[]> = {
      status: "success",
      results: products.length,
      data: products,
    };
    sendResponse(200, response, res);
  }
);

// get product on shop
export const getSingleProductInShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const product: IProduct | null = await Product.findOne({
      sourceType: "shop",
      shopId: req.params.shopId,
      _id: req.params.productId,
    });
    if (!product) {
      return next(
        new AppError(
          "No product found with this id and related to this shop ",
          404
        )
      );
    }
    const response: ApiResponse<IProduct> = {
      status: "success",
      data: product,
    };
    sendResponse(200, response, res);
  }
);

// freezing product on shop
export const freezingProductInShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId, productId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const product: IProduct | null = await Product.findOne({
      sourceType: "shop",
      shopId: shop._id,
      _id: productId,
    });
    if (!product) {
      return next(
        new AppError(
          "No product found with this id and related to this shop ",
          404
        )
      );
    }
    if (product.freezed) {
      return next(new AppError("Product is already frozen.", 400));
    }
    product.freezed = true;
    await product.save();
    const response: ApiResponse<IProduct> = {
      status: "success",
      message: "Product frozen successfully.",
      data: product,
    };
    sendResponse(200, response, res);
  }
);

// un-freezing product on shop
export const unfreezingProductInShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId, productId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const product: IProduct | null = await Product.findOne({
      sourceType: "shop",
      shopId: shop._id,
      _id: productId,
    });
    if (!product) {
      return next(
        new AppError(
          "No product found with this id and related to this shop ",
          404
        )
      );
    }
    if (!product.freezed) {
      return next(new AppError("Product is not frozen.", 400));
    }
    product.freezed = false;
    await product.save();
    const response: ApiResponse<IProduct> = {
      status: "success",
      message: "Product un-freezed successfully",
      data: product,
    };
    sendResponse(200, response, res);
  }
);

//TODO: This is still not completed
// get all orders on shop
export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {}
);

// get single order on shop
export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {}
);
