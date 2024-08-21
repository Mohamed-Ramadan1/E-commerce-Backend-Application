import { Response, NextFunction } from "express";

import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
import AppError from "../utils/ApplicationError";
import { ShoppingCartRequest } from "../shared-interfaces/shoppingCartRequest.interface";
import CartItem from "../models/cartItemModel";
import { ICartItem } from "../models/cartItem.interface";
import catchAsync from "../utils/catchAsync";
import { IShoppingCart } from "../models/shoppingCart.interface";

export const checkItemValidity = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // get required data from request body.
    const { productId, quantity } = req.body;
    // check required data exist
    if (!productId || !quantity) {
      return next(new AppError("productId and quantity are required", 400));
    }

    // check if the product exists with the given id.
    const product = await Product.findById(productId);

    // check if the product exists
    if (!product) {
      return next(new AppError(" product not found", 404));
    }

    // check if the product stock quantity is less than the required quantity
    if (product.stock_quantity < quantity) {
      return next(
        new AppError(" stock quantity  less than your required quantity", 400)
      );
    }

    // check if the user has a shopping cart
    const userShopCart: IShoppingCart | null = await ShoppingCart.findById(
      req.user.shoppingCart
    );

    // check if the user has a shopping cart
    if (!userShopCart) {
      return next(new AppError("something went wrong", 400));
    }

    // check if the user has the product in his cart
    const userShoppingCartItem: ICartItem | null = await CartItem.findOne({
      cart: req.user.shoppingCart,
      product: productId,
    });

    // check if the user has the product in his cart and the quantity is greater than the stock quantity
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
