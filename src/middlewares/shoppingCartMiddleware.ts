import { Response, NextFunction } from "express";

import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
import AppError from "../utils/ApplicationError";
import { RequestWithProductAndUser } from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
import { ICartItem } from "../models/cartItem.interface";
import catchAsync from "../utils/catchAsync";

export const checkItemValidity = catchAsync(
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
    req.product = product;
    req.userShopCart = userShopCart;
    req.userShoppingCartItem = userShoppingCartItem;
    next();
  }
);
