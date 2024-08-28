import { IOrder, ShippingStatus } from "../../models/order.interface";
import { ClientSession } from "mongoose";
import ShopOrder from "../../models/shopOrderModal";
import AppError from "../ApplicationError";
export const updateSubOrderShippingStatus = async (
  order: IOrder,
  session: ClientSession,
  shippingStatus: ShippingStatus
) => {
  const updatedSubOrders = await ShopOrder.updateMany(
    {
      mainOrder: order._id,
    },
    {
      $set: { shippingStatus },
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
