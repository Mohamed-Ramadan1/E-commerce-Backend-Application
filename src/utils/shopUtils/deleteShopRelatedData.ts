import ShopSupportTicket from "../../models/shopSupportTicket/shopSupportTicketModal";
import Notification from "../../models/notification/notificationModal";
import SubOrder from "../../models/subOrders/subOrderModal";
import Product from "../../models/product/productModel";
import { IShop } from "../../models/shop/shop.interface";
import { NextFunction } from "express";
import { ClientSession } from "mongoose";
import AppError from "../apiUtils/ApplicationError";

type DeleteResult =
  | { deletedCount?: number }
  | { acknowledged: boolean; deletedCount: number }
  | null;

export async function cascadeShopDeletion(
  shop: IShop,
  session: ClientSession,
  next: NextFunction
): Promise<void> {
  try {
    const deleteOperations: Promise<DeleteResult>[] = [
      ShopSupportTicket.deleteMany({ shop: shop._id }).session(session),
      Notification.deleteMany({ user: shop._id }).session(session),
      SubOrder.deleteMany({ shop: shop._id }).session(session),
      Product.deleteMany({ shop: shop._id }).session(session),
    ];

    const results = await Promise.all(deleteOperations);

    console.log(`Deleted related data for shop ${shop._id}:`, results);
  } catch (error) {
    console.error(`Error deleting related data for shop ${shop._id}:`, error);
    return next(
      new AppError("Error occurred during shop related data deletion", 500)
    );
  }
}
