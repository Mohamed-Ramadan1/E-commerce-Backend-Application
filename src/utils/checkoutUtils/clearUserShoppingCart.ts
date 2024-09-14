import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { ClientSession } from "mongoose";
// clear the user shopping cart.
export const clearShoppingCart = async (
  shoppingCart: IShoppingCart,
  session: ClientSession
) => {
  (shoppingCart.items = []),
    (shoppingCart.total_quantity = 0),
    (shoppingCart.total_discount = 0),
    (shoppingCart.total_price = 0),
    (shoppingCart.total_shipping_cost = 0),
    (shoppingCart.discount_code_amount = undefined),
    (shoppingCart.discount_code_applied = false),
    (shoppingCart.discount_code = undefined),
    await shoppingCart.save();
};
