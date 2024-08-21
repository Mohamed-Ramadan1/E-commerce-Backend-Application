// system imports
import { Response, NextFunction } from "express";

// model imports
import Order from "../models/orderModel";
import CartItem from "../models/cartItemModel";

// interface imports
import { IOrder } from "../models/order.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

import { CheckoutRequest } from "../shared-interfaces/checkoutRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { createOrderObject } from "../utils/checkoutUtils/createOrderObject";
import { clearShoppingCart } from "../utils/checkoutUtils/clearUserShoppingCart";
import { updateUserPurchaseHistory } from "../utils/checkoutUtils/updateUserPurchaseHistory";
import { updateProductsStockQuantity } from "../utils/checkoutUtils/updateProductsStockQuantity";
import { groupItemsByShop } from "../utils/checkoutUtils/groupShopCartItemsBySource";
import {
  createSubOrders,
  GroupedItems,
} from "../utils/checkoutUtils/createSupOrders";

// modules imports
import mongoose from "mongoose";
import Stripe from "stripe";

// emails imports
import checkoutConfirmationEmail from "../emails/users/checkoutConfirmationEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

export const checkoutWithCash = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    //extract the shipping address, shopping cart and user from the request object
    const { shipAddress, shoppingCart, user, phoneNumber } = req;

    // create order objects.
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

    // creating suborders and sending emails to the vendors

    // groupe the items based on the shop or the website vender type
    const groups = groupItemsByShop(shoppingCart.items);

    createSubOrders(groups as GroupedItems, userOrder);

    // Update the stock quantity of the products
    await updateProductsStockQuantity(shoppingCart, next);

    // update the user purchase history
    await updateUserPurchaseHistory(user, shoppingCart);

    // deleting the cart items form cart item collection
    await CartItem.deleteMany({
      cart: shoppingCart._id,
    });

    // clear the shopping cart
    await clearShoppingCart(shoppingCart);

    // send confirmation email to the user with the order details.
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
