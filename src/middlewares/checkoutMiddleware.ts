import { Response, NextFunction } from "express";
import ShoppingCart from "../models/shoppingCartModel";
import Product from "../models/productModel";
import AppError from "../utils/ApplicationError";
import { CheckoutRequest } from "../shared-interfaces/request.interface";
import catchAsync from "../utils/catchAsync";
import { ICartItem } from "../models/cartItem.interface";
import { IProduct } from "../models/product.interface";

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
    // check if the cart not exits or the cart items 0 is empty
    if (!userShopCart || userShopCart.items.length === 0) {
      return next(new AppError("Your shopping cart is empty", 400));
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

    // pass the shopping cart and the shipping address to the request object
    const transformedCart = new ShoppingCart(userShopCart);
    req.shoppingCart = transformedCart;
    req.shipAddress = shipAddress;

    // retrieve the products from the cart items and check if the product is available in the stock or not
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
