import { ClientSession } from "mongoose";
import Wishlist from "../../models/wishlistModel";
import ShoppingCart from "../../models/shoppingCartModel";
import CartItem from "../../models/cartItemModel";
import ShopRequest from "../../models/shopRequestModal";
import ReturnProduct from "../../models/returnProductsModel";
import RefundRequest from "../../models/refundModel";
import Order from "../../models/orderModel";
import SupportTicket from "../../models/supportTicketsModel";

import Notification from "../../models/notificationModal";
import Review from "../../models/reviewModel";
import { IUser } from "../../models/user.interface";
import { NextFunction } from "express";
import AppError from "../ApplicationError";

export async function cascadeUserDeletion(
  user: IUser,
  session: ClientSession,
  next: NextFunction
): Promise<void> {
  if (user.myShop) {
    return next(
      new AppError(
        "This action cannot be completed where user has a shop. Before doing this action, user should open a delete shop request first.",
        400
      )
    );
  }

  const deleteOperations = [
    Wishlist.deleteMany({ user: user._id }).session(session),
    ShoppingCart.deleteOne({ user: user._id }).session(session),
    CartItem.deleteMany({ cart: user._id }).session(session),
    ShopRequest.findOneAndDelete({ user: user._id }).session(session),
    ReturnProduct.deleteMany({ user: user._id }).session(session),
    RefundRequest.deleteMany({ user: user._id }).session(session),
    Order.deleteMany({ user: user._id }).session(session),
    SupportTicket.deleteMany({ user: user._id }).session(session),
    Notification.deleteMany({ user: user._id }).session(session),
    Review.deleteMany({ user: user._id }).session(session),
  ];

  try {
    await Promise.all(deleteOperations);
  } catch (error) {
    console.error(`Error deleting data for user ${user._id}:`, error);
    return next(new AppError("Error occurred during user data deletion", 500));
  }
}
