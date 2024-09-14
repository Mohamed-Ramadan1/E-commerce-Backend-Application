import { ClientSession } from "mongoose";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import CartItem from "../../models/cartItem/cartItemModel";

export async function clearCartItems(
  shoppingCart: IShoppingCart,
  session: ClientSession
): Promise<void> {
  await CartItem.deleteMany({ cart: shoppingCart._id }).session(session);
}
