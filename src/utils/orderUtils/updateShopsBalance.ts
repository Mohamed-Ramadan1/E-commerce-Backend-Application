import { ClientSession } from "mongoose";
import { IOrder } from "../../models/order.interface";
import ShopOrder from "../../models/shopOrderModal";
import { IShopOrder } from "../../models/shopOrder.interface";

export const updateShopsBalance = async (
  mainOrder: IOrder,
  session: ClientSession
) => {
  const shopOrDresses = (await ShopOrder.find({
    mainOrder: mainOrder._id,
    vendorType: "shop",
  })) as IShopOrder[];

  if (!shopOrDresses) return;

  for (const shopOrder of shopOrDresses) {
    const shop = shopOrder.shop;
    const shopBalance = shop.balance;
    const netPrice = shopOrder.netPrice;
    shop.balance = shopBalance + netPrice;
    await shop.save({ session });
  }
};
