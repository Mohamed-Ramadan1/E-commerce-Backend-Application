import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { IUser } from "../../models/user/user.interface";
import { GroupedItems } from "./createSupOrders";
import { NextFunction } from "express";
import { OrderObject } from "./createOrderObject";
import { IOrder } from "../../models/order/order.interface";
import AppError from "../apiUtils/ApplicationError";

import mongoose, { ClientSession } from "mongoose";
import { updateUserPurchaseHistory } from "./updateUserPurchaseHistory";
import { updateProductsStockQuantity } from "./updateProductsStockQuantity";
import { createSubOrders } from "./createSupOrders";
import { clearShoppingCart } from "./clearUserShoppingCart";
import checkoutConfirmationEmail from "../../emails/users/checkoutConfirmationEmail";
import { clearCartItems } from "./clearCartItems";
import { createOrder } from "./createOrder";

export async function processCheckout(
  orderObject: OrderObject,
  shoppingCart: IShoppingCart,
  user: IUser,
  groups: GroupedItems
): Promise<IOrder | void> {
  const session: ClientSession = await mongoose.startSession();
  try {
    session.startTransaction();

    // create the order
    const userOrder = await createOrder(orderObject, user, session);

    // create the sub orders
    await createSubOrders(groups, userOrder, session),
      await Promise.all([
        updateProductsStockQuantity(shoppingCart, session),
        updateUserPurchaseHistory(user, shoppingCart, session),
        clearCartItems(shoppingCart, session),
        clearShoppingCart(shoppingCart, session),
      ]);

    checkoutConfirmationEmail(user, userOrder);

    await session.commitTransaction();
    return userOrder;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError("Failed to process checkout", 500);
  } finally {
    session.endSession();
  }
}
