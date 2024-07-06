// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";

// utils imports
import catchAsync from "../utils/catchAsync";

// emails imports

/* 
TODO: add products to the shop.
TODO: delete  products from the shop.
TODO: update products in the shop.
TODO: get all products in the shop.
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

export const addProductsToShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteProductsFromShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateProductsInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllProductsInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
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

export const createDiscountCouponOnProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteDiscountCouponOnProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
