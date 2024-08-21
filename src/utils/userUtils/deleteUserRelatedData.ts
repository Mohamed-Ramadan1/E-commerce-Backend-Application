import Wishlist from "../../models/wishlistModel";
import ShoppingCart from "../../models/shoppingCartModel";
import CartItem from "../../models/cartItemModel";
import ShopRequest from "../../models/shopRequestModal";
import Shop from "../../models/shopModal";
import { IUser } from "../../models/user.interface";

type DeleteResult =
  | { deletedCount?: number }
  | { acknowledged: boolean; deletedCount: number }
  | null;

// delete all user related data when deleting the user.
export async function cascadeUserDeletion(user: IUser) {
  const deleteOperations: Promise<DeleteResult>[] = [
    Wishlist.deleteMany({ user: user._id }),
    ShoppingCart.deleteOne({ user: user._id }),
    CartItem.deleteMany({ cart: user._id }),
    ShopRequest.findOneAndDelete({ user: user._id }),
  ];

  if (user.myShop) {
    deleteOperations.push(Shop.deleteOne({ _id: user.myShop }));
  }

  await Promise.all(deleteOperations);
}
