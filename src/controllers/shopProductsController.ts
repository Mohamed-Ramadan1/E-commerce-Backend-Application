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

/* 
TODO: add products to the shop.
TODO: delete  products from the shop.
TODO: update products in the shop.
//TODO: get all products in the shop.
TODO: get a single product in the shop.

TODO:  freezing product in the shop.
TODO: un-freezing product in the shop.

TODO: create discount coupon on the products .
TODO: delete discount coupon on the products.

TODO: get all orders created on the shop.
TODO: get a single order created on the shop.


TODO: Activate the shop.
TODO: Deactivate the shop.
TODO: Delete the shop request.

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
    const product: IProduct = await Product.create(req.body);
    const json: ApiResponse<IProduct> = {
      status: "success",
      data: product,
    };
    sendResponse(201, json, res);
  }
);

export const deleteProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);

export const updateProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);

export const freezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);

export const unfreezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);

export const createProductDiscountCode = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);

export const deleteProductDiscountCode = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {}
);
