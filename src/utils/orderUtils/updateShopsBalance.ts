import { ClientSession } from "mongoose";
import { IOrder } from "../../models/order/order.interface";
import SubOrder from "../../models/subOrders/subOrderModal";
import { ISubOrder } from "../../models/subOrders/subOrder.interface";

export const updateShopsBalance = async (
  mainOrder: IOrder,
  session: ClientSession
) => {
  const shopOrDresses = (await SubOrder.find({
    mainOrder: mainOrder._id,
    vendorType: "shop",
  })) as ISubOrder[];

  if (!shopOrDresses) return;

  for (const shopOrder of shopOrDresses) {
    const shop = shopOrder.shop;
    const shopBalance = shop.balance;
    const netPrice = shopOrder.netPrice;
    shop.balance = shopBalance + netPrice;
    await shop.save({ session });
  }
};
