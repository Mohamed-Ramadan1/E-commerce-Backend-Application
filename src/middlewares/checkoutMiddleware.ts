import { Request, Response, NextFunction } from "express";
import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
import AppError from "../utils/ApplicationError";
import { AuthUserRequest } from "../shared-interfaces/request.interface";
import catchAsync from "../utils/catchAsync";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { ICartItem } from "../models/cartItem.interface";
import { IProduct } from "../models/product.interface";

export const checkCartAvailability = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    // Populate the product field in the items array
    const userShopCart = await ShoppingCart.findById(
      req.user.shoppingCart
    ).populate<{
      items: (ICartItem & { product: IProduct })[];
    }>({
      path: "items.product",
      model: Product,
    });

    if (!userShopCart || userShopCart.items.length === 0) {
      return next(new AppError("Your shopping cart is empty", 400));
    }

    for (const cartItem of userShopCart.items) {
      const product = cartItem.product;

      if (!product || product.stock_quantity < cartItem.quantity) {
        return next(
          new AppError(
            `The product ${
              product?.name || "unknown product"
            } is out of stock or does not have sufficient quantity`,
            400
          )
        );
      }
    }

    next();
  }
);
