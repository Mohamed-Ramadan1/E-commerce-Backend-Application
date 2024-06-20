import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import Order from "../models/orderModel";
// import CartItem from "../models/cartItemModel";
import { Response, NextFunction } from "express";

import { CheckoutRequest } from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";
import { ICartItem } from "../models/cartItem.interface";
import ShoppingCart from "../models/shoppingCartModel";
import { ObjectId } from "mongoose";
import { IProduct } from "../models/product.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IOrder } from "../models/order.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { sendResponse } from "../utils/sendResponse";
import Stripe from "stripe";
import { IUser } from "../models/user.interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

const updateProductsStockQuantity = async (
  shoppingCartId: ObjectId,
  next: NextFunction
) => {
  const userShopCart = await ShoppingCart.findById(shoppingCartId).populate<{
    items: (ICartItem & { product: IProduct })[];
  }>({
    path: "items.product",
    model: Product,
  });

  if (!userShopCart) {
    return next(new AppError("something went wrong", 400));
  }
  // Iterate through the items and update the stock quantities
  for (const cartItem of userShopCart.items) {
    const product = cartItem.product;
    if (product) {
      product.stock_quantity -= cartItem.quantity;
      if (product.stock_quantity < 0) {
        product.stock_quantity = 0; // Ensure stock quantity doesn't go negative
      }
      await product.save();
    }
  }
};
const updateUserPurchaseHistory = async (
  user: IUser,
  shoppingCart: IShoppingCart
) => {
  const productIds = shoppingCart.items.map((item: any) => item.product._id);
  for (const productId of productIds) {
    if (!user.purchaseHistory.includes(productId)) {
      user.purchaseHistory.push(productId);
    }
  }
  await user.save({ validateBeforeSave: false });
};

const clearShoppingCart = async (shoppingCart: IShoppingCart) => {
  // Clear the shopping cart
  shoppingCart.items = [];
  shoppingCart.total_quantity = 0;
  shoppingCart.total_discount = 0;
  shoppingCart.total_price = 0;
  shoppingCart.total_shipping_cost = 0;
  // save the updated shopping cart
  await shoppingCart.save();
};

export const checkoutWithCash = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    //extract the shipping address, shopping cart and user from the request object
    const { shipAddress, shoppingCart, user } = req;

    // Order object
    const orderObject: object = {
      user: user._id,
      items: shoppingCart.items,
      itemsQuantity: shoppingCart.total_quantity,
      totalDiscount: shoppingCart.total_discount,
      shippingAddress: shipAddress,
      totalPrice: shoppingCart.total_price + shoppingCart.total_shipping_cost,
      shippingCost: shoppingCart.total_shipping_cost,
      paymentStatus: "payment_on_delivery",
      paymentMethod: "cash",
      shippingStatus: "pending",
      orderStatus: "processing",
    };

    // create the order
    const userOrder = await Order.create(orderObject);

    // Update the stock quantity of the products
    await updateProductsStockQuantity(shoppingCart._id, next);
    await updateUserPurchaseHistory(user, shoppingCart);
    // deleting the cart items form cart item collection
    await CartItem.deleteMany({
      cart: shoppingCart._id,
    });

    // clear the shopping cart
    await clearShoppingCart(shoppingCart);

    // generate the response object
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: userOrder,
    };
    // send the response
    sendResponse(200, response, res);
  }
);

// latest to anther development stage.
export const checkoutWithStripe = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    //extract the shipping address, shopping cart and user from the request object
    const { shipAddress, shoppingCart, user } = req;

    // payment with stripe and complete the order if payment is successful

    // Order object
    const orderObject: object = {
      user: user._id,
      items: shoppingCart.items,
      itemsQuantity: shoppingCart.total_quantity,
      totalDiscount: shoppingCart.total_discount,
      shippingAddress: shipAddress,
      totalPrice: shoppingCart.total_price + shoppingCart.total_shipping_cost,
      shippingCost: shoppingCart.total_shipping_cost,
      paymentStatus: "paid",
      paymentMethod: "credit_card",
      shippingStatus: "pending",
      orderStatus: "processing",
    };

    // create the order
    const userOrder = await Order.create(orderObject);

    // Update the stock quantity of the products
    await updateProductsStockQuantity(shoppingCart._id, next);
    // deleting the cart items form cart item collection
    await CartItem.deleteMany({
      cart: shoppingCart._id,
    });
    /* later the payment will added here after creating the front end */
    // clear the shopping cart
    await clearShoppingCart(shoppingCart);

    // generate the response object
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: userOrder,
    };
    // send the response
    sendResponse(200, response, res);
  }
);
