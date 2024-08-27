// system imports
import { NextFunction, Response } from "express";
import mongoose from "mongoose";
// models imports
import Shop from "../models/shopModal";
import Product from "../models/productModel";
import ShopOrder from "../models/shopOrderModal";

// interfaces imports
import { IShop } from "../models/shop.interface";
import { IShopOrder } from "../models/shopOrder.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ShopsManagementRequest } from "../shared-interfaces/shopMangmentRequest.interface";
// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";
import { cascadeShopDeletion } from "../utils/shopUtils/deleteShopRelatedData";
import { IProduct } from "../models/product.interface";

import APIFeatures from "../utils/apiKeyFeature";

// get all shops.
export const getAllShops = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Shop.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const shops: IShop[] = await features.execute();

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const shop: IShop | null = await Shop.findByIdAndDelete(
        req.params.shopId
      ).session(session);

      if (!shop) {
        throw new AppError("Shop not found", 404);
      }

      await cascadeShopDeletion(shop, session, next);

      await session.commitTransaction();

      const response: ApiResponse<null> = {
        status: "success",
        data: null,
      };
      sendResponse(204, response, res);
    } catch (error) {
      await session.abortTransaction();
      throw error; // Re-throw the error to be caught by catchAsync
    } finally {
      session.endSession();
    }
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
    const features = new APIFeatures(
      Product.find({
        sourceType: "shop",
        shopId: shop._id,
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products: IProduct[] = await features.execute();

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

// get all orders on shop
export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const features = new APIFeatures(
      ShopOrder.find({ shop: shop._id }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders: IShopOrder[] = await features.execute();
    const response: ApiResponse<IShopOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);

// get single order on shop
export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: ShopsManagementRequest, res: Response, next: NextFunction) => {
    const { shopId, orderId } = req.params;
    const shop: IShop | null = await Shop.findById(shopId);
    if (!shop) {
      return next(new AppError("No shop found with this id.", 404));
    }
    const order: IShopOrder | null = await ShopOrder.findOne({
      shop: shop._id,
      _id: orderId,
    });
    if (!order) {
      return next(
        new AppError(
          "No order found with this id and related to this shop.",
          404
        )
      );
    }
    const response: ApiResponse<IShopOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);
