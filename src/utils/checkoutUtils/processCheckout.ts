import { IShoppingCart } from "../../models/shoppingCart.interface";
import { IUser } from "../../models/user.interface";
import { GroupedItems } from "./createSupOrders";
import { NextFunction } from "express";
import { OrderObject } from "./createOrderObject";
import { IOrder } from "../../models/order.interface";
import Order from "../../models/orderModel";
import AppError from "../ApplicationError";
import CartItem from "../../models/cartItemModel";

import mongoose, { ClientSession } from "mongoose";
import { updateUserPurchaseHistory } from "./updateUserPurchaseHistory";
import { updateProductsStockQuantity } from "./updateProductsStockQuantity";
import { createSubOrders } from "./createSupOrders";
import { clearShoppingCart } from "./clearUserShoppingCart";

import checkoutConfirmationEmail from "../../emails/users/checkoutConfirmationEmail";

export async function processCheckout(
  orderObject: OrderObject,
  shoppingCart: IShoppingCart,
  user: IUser,
  groups: GroupedItems,
  next: NextFunction
): Promise<IOrder | void> {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  const [userOrder] = await Order.create([orderObject], { session });

  if (!userOrder) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError("Failed to create order", 500));
  }
  await createSubOrders(groups, userOrder, session);

  await Promise.all([
    updateProductsStockQuantity(shoppingCart, next, session),
    updateUserPurchaseHistory(user, shoppingCart, session),
    CartItem.deleteMany({ cart: shoppingCart._id }).session(session),
    clearShoppingCart(shoppingCart, session),
  ]);

  checkoutConfirmationEmail(user, userOrder);

  await session.commitTransaction();
  session.endSession();

  return userOrder;
}
