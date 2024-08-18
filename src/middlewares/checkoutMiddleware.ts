import { Response, NextFunction } from "express";
import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
import AppError from "../utils/ApplicationError";
import { CheckoutRequest } from "../shared-interfaces/request.interface";
import catchAsync from "../utils/catchAsync";
import { ICartItem } from "../models/cartItem.interface";
import { IProduct } from "../models/product.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";

export const checkCartAvailability = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    // Populate the product field in the items array
    const userShopCart = await ShoppingCart.findById(
      req.user.shoppingCart
    ).populate<{
      items: (ICartItem & { product: IProduct })[];
    }>({
      path: "items.product",
      model: Product,
    });

    console.log(userShopCart);
    if (!userShopCart) {
      const newShopCart = await ShoppingCart.create({
        user: req.user._id,
      });
      req.user.shoppingCart = newShopCart._id;
      await req.user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "your shopping cart was not exist we created on and assigned to you please now fill your cart with the items and checkout .",
          500
        )
      );
    }
    // check if the cart is empty
    if (userShopCart!.items.length === 0) {
      return next(
        new AppError(
          "Your shopping cart is empty please add items before you checkout.",
          400
        )
      );
    }

    // check if the user provided a shipping address on the request or on his account or not
    const shipAddress: string | undefined =
      req.user.shippingAddress || req.body.shippingAddress;

    if (!shipAddress) {
      return next(
        new AppError(
          "Please provide a shipping address or add shipping address to your profile ",
          400
        )
      );
    }

    const phoneNumber: string | undefined =
      req.user.phoneNumber || req.body.phoneNumber;
    if (!phoneNumber) {
      return next(
        new AppError(
          "Please provide a phone number or add phone number to your profile ",
          400
        )
      );
    }

    // pass the shopping cart and the shipping address to the request object
    const transformedCart = new ShoppingCart(userShopCart);
    req.shoppingCart = transformedCart;
    req.shipAddress = shipAddress;
    req.phoneNumber = phoneNumber;

    // retrieve the products from the cart items and check if the product is available in the stock or not
    for (const cartItem of userShopCart!.items) {
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
