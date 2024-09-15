import {
  IOrder,
  OrderStatus,
  ShippingStatus,
} from "../../models/order/order.interface";
import { ClientSession } from "mongoose";
import SubOrder from "../../models/order/subOrderModal";
import AppError from "../apiUtils/ApplicationError";

export const delverSubOrders = async (
  order: IOrder,
  session: ClientSession,
  shippingStatus: ShippingStatus,
  orderStatus: OrderStatus
) => {
  console.log(orderStatus, shippingStatus);

  const updatedSubOrders = await SubOrder.updateMany(
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
