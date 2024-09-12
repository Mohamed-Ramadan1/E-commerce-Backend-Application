import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { IUser } from "../../models/user/user.interface";
import { GroupedItems } from "./createSupOrders";
import { NextFunction } from "express";
import { OrderObject } from "./createOrderObject";
import { IOrder } from "../../models/order/order.interface";
import Order from "../../models/order/orderModel";
import AppError from "../apiUtils/ApplicationError";
import CartItem from "../../models/cartItem/cartItemModel";
import { updateUserLoyaltyPoints } from "./updateUserLoyaltyPoints";

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
  try {
    const [userOrder] = await Order.create([orderObject], { session });

    if (!userOrder) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError("Failed to create order", 500);
    }

    // calculate and save user loyality points
    await updateUserLoyaltyPoints(user, userOrder, session);

    // create the sub orders that related to shops and website venders.
    await createSubOrders(groups, userOrder, session);

    await Promise.all([
      updateProductsStockQuantity(shoppingCart, next, session),
      updateUserPurchaseHistory(user, shoppingCart, session),
      CartItem.deleteMany({ cart: shoppingCart._id }).session(session),
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
