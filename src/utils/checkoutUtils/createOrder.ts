import { OrderObject } from "./createOrderObject";
import { IUser } from "../../models/user/user.interface";
import { ClientSession } from "mongoose";
import { IOrder } from "../../models/order/order.interface";
import Order from "../../models/order/orderModel";
import { applyGiftCard } from "./applyGiftCard";
import AppError from "../apiUtils/ApplicationError";

export async function createOrder(
  orderObject: OrderObject,
  user: IUser,
  session: ClientSession
): Promise<IOrder> {
  const userOrder = new Order(orderObject);
  applyGiftCard(user, userOrder);

  // adding the prime features
  if (user.isPrimeUser) {
    userOrder.shippingCost = 0;
  }
  await userOrder.save({ session });

  if (!userOrder) {
    throw new AppError("Failed to create order", 500);
  }

  return userOrder;
}
