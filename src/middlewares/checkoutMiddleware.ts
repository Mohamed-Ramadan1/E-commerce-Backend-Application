import { Response, NextFunction } from "express";
import ShoppingCart from "../models/shoppingCartModel";
import AppError from "../utils/ApplicationError";
import { CheckoutRequest } from "../shared-interfaces/checkoutRequest.interface";
import catchAsync from "../utils/catchAsync";

export const checkCartAvailability = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    // get the user shop cart
    const userShopCart = await ShoppingCart.findById(req.user.shoppingCart);
    // check if the user not have a shop cart and if not create and assign new one .
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
    if (userShopCart.items.length === 0) {
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

    // validate if the use provide a phone number or not
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
    req.shoppingCart = userShopCart;
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
