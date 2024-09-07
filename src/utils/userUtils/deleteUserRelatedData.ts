import { ClientSession } from "mongoose";
import Wishlist from "../../models/wishlist/wishlistModel";
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import CartItem from "../../models/cartItem/cartItemModel";
import ShopRequest from "../../models/newShopRequest/shopRequestModal";
import ReturnProduct from "../../models/returnProduct/returnProductsModel";
import RefundRequest from "../../models/refundRequest/refundModel";
import Order from "../../models/order/orderModel";
import SupportTicket from "../../models/userSupportTicket/supportTicketsModel";
import Notification from "../../models/notification/notificationModal";
import Review from "../../models/review/reviewModel";
import { IUser } from "../../models/user/user.interface";
import { NextFunction } from "express";
import AppError from "../apiUtils/ApplicationError";

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
