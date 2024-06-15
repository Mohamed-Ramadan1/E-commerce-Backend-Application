import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
// import CartItem from "../models/cartItemModel";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import { IShoppingCart } from "../models/shoppingCart.interface";
import {
  AuthUserRequest,
  RequestWithProductAndUser,
} from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
import { ICartItem } from "../models/cartItem.interface";

export const getShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const userShopCart = await ShoppingCart.findOne({
      user: req.user._id,
    });

    if (!userShopCart) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);

export const addItemToShoppingCart = catchAsync(
  async (req: RequestWithProductAndUser, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return next(new AppError("productId and quantity are required", 400));
    }
    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError(" product not found", 404));
    }
    if (product.stock_quantity < quantity) {
      return next(
        new AppError(" stock quantity  less than your required quantity", 400)
      );
    }
    const userShopCart = await ShoppingCart.findById(req.user.shoppingCart);
    if (!userShopCart) {
      return next(new AppError("something went wrong", 400));
    }
    const userShoppingCartItem: ICartItem | null = await CartItem.findOne({
      cart: req.user.shoppingCart,
      product: productId,
    });

    if (
      userShoppingCartItem &&
      userShoppingCartItem.quantity + quantity > product.stock_quantity
    ) {
      return next(
        new AppError(" stock quantity  less than your required quantity", 400)
      );
    }

    if (userShoppingCartItem) {
      userShoppingCartItem.quantity += quantity;
      await userShoppingCartItem.save();
    }
    if (!userShoppingCartItem) {
      const shopCartItem = await CartItem.create({
        cart: req.user.shoppingCart,
        product: productId,
        quantity,
        price: product.price,
      });
      userShopCart.items.push(shopCartItem._id);
      await userShopCart.save();
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      results: 1,
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);

export const removeItemFromShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {}
);

export const clearShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    console.log(req.user._id);
    const userShopCart = await ShoppingCart.findOneAndUpdate(
      { user: req.user._id },
      {
        items: [],
        total_quantity: 0,
        total_discount: 0,
        total_price: 0,
        total_shipping_cost: 0,
        payment_status: "pending",
        payment_method: "cash",
      },
      {
        new: true,
      }
    );
    await CartItem.deleteMany({
      cart: req.user.shoppingCart,
    });
    console.log(userShopCart);
    if (!userShopCart) {
      return next(new AppError("You are not authorized", 401));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);
