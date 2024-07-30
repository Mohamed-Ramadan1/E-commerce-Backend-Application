// system imports
import { Response, NextFunction } from "express";

// model imports
import Order from "../models/orderModel";
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";
import ShoppingCart from "../models/shoppingCartModel";

// interface imports
import { IUser } from "../models/user.interface";
import { ICartItem } from "../models/cartItem.interface";
import { IProduct } from "../models/product.interface";
import { IOrder } from "../models/order.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

import { CheckoutRequest } from "../shared-interfaces/request.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

// modules imports
import { ObjectId } from "mongoose";
import Stripe from "stripe";

// emails imports
import checkoutConfirmationEmail from "../emails/users/checkoutConfirmationEmail";

//----------------------------
//Helper functions and types

type OrderObject = {
  user: ObjectId;
  items: ICartItem[];
  itemsQuantity: Number;
  totalDiscount: Number;
  shippingAddress: string;
  phoneNumber: string;
  totalPrice: Number;
  shippingCost: Number;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  orderStatus: string;
};

const createOrderObject = (
  user: ObjectId,
  items: ICartItem[],
  itemsQuantity: Number,
  totalDiscount: Number,
  shippingAddress: string,
  phoneNumber: string,
  totalPrice: Number,
  shippingCost: Number,
  paymentStatus: string,
  paymentMethod: string,
  shippingStatus: string,
  orderStatus: string
) => {
  const orderData: OrderObject = {
    user,
    items,
    itemsQuantity,
    totalDiscount,
    shippingAddress,
    phoneNumber,
    totalPrice,
    shippingCost,
    paymentStatus,
    paymentMethod,
    shippingStatus,
    orderStatus,
  };
  return orderData;
};

// TODO Create shop orders instance for shops based on the products they have in their shops

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

// update the stock quantity after the order created.
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
    const { shipAddress, shoppingCart, user, phoneNumber } = req;

    const orderObject = createOrderObject(
      user._id,
      shoppingCart.items as any,
      shoppingCart.total_quantity,
      shoppingCart.total_discount,
      shipAddress,
      phoneNumber,
      shoppingCart.total_price + shoppingCart.total_shipping_cost,
      shoppingCart.total_shipping_cost,
      "payment_on_delivery",
      "cash",
      "pending",
      "processing"
    );

    // create the order
    const userOrder: IOrder = await Order.create(orderObject);

    // Update the stock quantity of the products
    await updateProductsStockQuantity(shoppingCart._id, next);

    await updateUserPurchaseHistory(user, shoppingCart);
    // deleting the cart items form cart item collection
    await CartItem.deleteMany({
      cart: shoppingCart._id,
    });

    // clear the shopping cart
    await clearShoppingCart(shoppingCart);
    checkoutConfirmationEmail(user, userOrder);
    // generate the response object
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: userOrder,
    };
    // send the response
    sendResponse(200, response, res);
  }
);

// payment on stripe this will completed on the last when i implement the front end
export const checkoutWithStripe = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {}
);

///////////////////////+
// Order object
// const orderObject: object = {
//   user: user._id,
//   items: shoppingCart.items,
//   itemsQuantity: shoppingCart.total_quantity,
//   totalDiscount: shoppingCart.total_discount,
//   shippingAddress: shipAddress,
//   phoneNumber: phoneNumber,
//   totalPrice: shoppingCart.total_price + shoppingCart.total_shipping_cost,
//   shippingCost: shoppingCart.total_shipping_cost,
//   paymentStatus: "payment_on_delivery",
//   paymentMethod: "cash",
//   shippingStatus: "pending",
//   orderStatus: "processing",
// };
