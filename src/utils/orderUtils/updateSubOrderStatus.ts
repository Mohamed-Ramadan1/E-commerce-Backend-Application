import { ClientSession } from "mongoose";
import { IOrder, OrderStatus } from "../../models/order.interface";
import ShopOrder from "../../models/shopOrderModal";
import AppError from "../ApplicationError";

export const updateSubOrdersState = async (
  masterOrder: IOrder,
  session: ClientSession,
  orderStatus: OrderStatus
) => {
  try {
    const updatedSubOrders = await ShopOrder.updateMany(
      {
        mainOrder: masterOrder._id,
      },
      {
        $set: { orderStatus },
      },
      {
        session,
      }
    );

    if (!updatedSubOrders.acknowledged) {
      throw new AppError("Error updating sub-orders while cancelling", 500);
    }
  } catch (error) {
    throw new AppError("Error updating sub-orders state", 500);
  }
};
