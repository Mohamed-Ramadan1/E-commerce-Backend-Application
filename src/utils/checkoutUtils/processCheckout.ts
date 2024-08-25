import { IShoppingCart } from "../../models/shoppingCart.interface";
import { IUser } from "../../models/user.interface";
import { GroupedItems } from "./createSupOrders";
import { NextFunction } from "express";
import { OrderObject } from "./createOrderObject";
import { IOrder } from "../../models/order.interface";
import Order from "../../models/orderModel";
import CartItem from "../../models/cartItemModel";

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
) {
  const userOrder: IOrder = await Order.create(orderObject);

  createSubOrders(groups, userOrder);

  await Promise.all([
    updateProductsStockQuantity(shoppingCart, next),
    updateUserPurchaseHistory(user, shoppingCart),
    CartItem.deleteMany({ cart: shoppingCart._id }),
    clearShoppingCart(shoppingCart),
  ]);

  checkoutConfirmationEmail(user, userOrder);

  return userOrder;
}
