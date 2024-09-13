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
    if (!user.active || !user.verified) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError("User not active or not verified", 403);
    }

    const userOrder: IOrder | void = new Order({
      ...orderObject,
    });
    // Apply gift card if available
    if (user.giftCard > 0) {
      let distractedAmount: number = 0;

      if (user.giftCard >= userOrder.totalPrice) {
        // Gift card covers full order
        distractedAmount = userOrder.totalPrice;
        userOrder.totalPrice = 0;
      } else {
        // Gift card covers partial order
        distractedAmount = user.giftCard;
        userOrder.totalPrice -= distractedAmount;
      }

      // Update user's gift card balance
      user.giftCard -= distractedAmount;

      // Store the paid amount with gift card
      userOrder.paidAmountWithUserGiftCard = distractedAmount;
    }

    await userOrder.save({ session });

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
