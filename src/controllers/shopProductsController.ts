// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";
import Product from "../models/productModel";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";
import { IProduct } from "../models/product.interface";
import { ShopProductsRequest } from "../shared-interfaces/shopProductsRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
// emails imports
import addProductConfirmationEmail from "../emails/shops-products/addProductConfirmationEmail";
import productUpdateConfirmationEmail from "../emails/shops-products/updateProductConfirmationEmail";
import productDeletionConfirmationEmail from "../emails/shops-products/deleteProductConfirmationEmail";
import productFreezeConfirmationEmail from "../emails/shops-products/freezingProductConfirmationEmail";
import productUnfreezeConfirmationEmail from "../emails/shops-products/unfreezingProductConfirmationEmail";

// starting withing it
/* 
//TODO: get all products in the shop.
// TODO: add products to the shop.
//TODO: update products in the shop.
//TODO: delete  products from the shop.

//TODO:  freezing product in the shop.
//TODO: un-freezing product in the shop.


*/
// get all products on shop
export const getAllProducts = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const shop = (await Shop.findById(req.params.shopId)) as IShop;
    const products: IProduct[] = await Product.find({
      shopId: shop.id,
    });
    const json: ApiResponse<IProduct[]> = {
      status: "success",
      results: products.length,
      data: products,
    };
    sendResponse(200, json, res);
  }
);

// add product to the shop
export const addProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const product: IProduct = await Product.create(req.productInformation);
    if (!product) {
      return next(
        new AppError("something went wrong while creating the new product", 500)
      );
    }
    // send product add confirmation email
    addProductConfirmationEmail(req.user, req.shop, product);

    const json: ApiResponse<IProduct> = {
      status: "success",
      data: product,
    };
    sendResponse(201, json, res);
  }
);

// update product confirmation email
export const updateProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    /* 
    all middleware validation is done on the middleware stage 
    the user is allowed to update the product data (note blocked ones.)
    */
    //update the product after filtering the body and insure the body not contain none required fildes.
    await Product.updateOne(
      {
        _id: product._id,
      },
      req.body
    );

    // send confirmation email
    productUpdateConfirmationEmail(req.user, shop, product);
    // create response json object
    const response: ApiResponse<null> = {
      status: "success",
      message: "Product updated successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// delete existing product
export const deleteProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // delete the product from the shop
    await Product.deleteOne({
      _id: product._id,
    });
    // send product delete confirmation email
    productDeletionConfirmationEmail(req.user, req.shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product deleted successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// freeze product in the shop
export const freezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // set the product as freezed
    await Product.updateOne(
      {
        _id: product._id,
      },
      {
        freezed: true,
      }
    );
    // send product freeze confirmation email
    productFreezeConfirmationEmail(req.user, shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product has been frozen successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// un-freeze product in the shop
export const unfreezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // set the product as un-freezed
    await Product.updateOne(
      {
        _id: product._id,
      },
      {
        freezed: false,
      }
    );
    // send product unfreeze confirmation email
    productUnfreezeConfirmationEmail(req.user, shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product has been unfrozen successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);
