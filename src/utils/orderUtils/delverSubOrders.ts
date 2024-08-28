import {
  IOrder,
  OrderStatus,
  ShippingStatus,
} from "../../models/order.interface";
import { ClientSession } from "mongoose";
import ShopOrder from "../../models/shopOrderModal";
import AppError from "../ApplicationError";

export const delverSubOrders = async (
  order: IOrder,
  session: ClientSession,
  shippingStatus: ShippingStatus,
  orderStatus: OrderStatus
) => {
  console.log(orderStatus, shippingStatus);

  const updatedSubOrders = await ShopOrder.updateMany(
    {
      mainOrder: order._id,
    },
    {
      $set: { shippingStatus, orderStatus },
    },
    { session }
  );

  if (!updatedSubOrders.acknowledged) {
    await session.abortTransaction();

    throw new AppError(
      "Error happened while updating the suborder status",
      500
    );
  }
};
