import { IShoppingCart } from "../../models/shoppingCart.interface";
import { IUser } from "../../models/user.interface";
import { ClientSession } from "mongoose";
// update the user purchase history after the order created.
export const updateUserPurchaseHistory = async (
  user: IUser,
  shoppingCart: IShoppingCart,
  session: ClientSession
) => {
  const productIds = shoppingCart.items.map((item: any) => item.product._id);
  for (const productId of productIds) {
    if (!user.purchaseHistory.includes(productId)) {
      user.purchaseHistory.push(productId);
    }
  }
  await user.save({ validateBeforeSave: false, session });
};
