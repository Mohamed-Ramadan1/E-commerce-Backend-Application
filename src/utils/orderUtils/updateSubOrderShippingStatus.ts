import { IOrder, ShippingStatus } from "../../models/order/order.interface";
import { ClientSession } from "mongoose";
import SubOrder from "../../models/subOrders/subOrderModal";
import AppError from "../apiUtils/ApplicationError";
export const updateSubOrderShippingStatus = async (
  order: IOrder,
  session: ClientSession,
  shippingStatus: ShippingStatus
) => {
  const updatedSubOrders = await SubOrder.updateMany(
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
