import ShoppingCart from "../../models/shoppingCartModel";
import { IShoppingCart } from "../../models/shoppingCart.interface";
// clear the user shopping cart.
export const clearShoppingCart = async (shoppingCart: IShoppingCart) => {
  await ShoppingCart.updateOne(
    { _id: shoppingCart._id },
    {
      $set: {
        items: [],
        total_quantity: 0,
        total_discount: 0,
        total_price: 0,
        total_shipping_cost: 0,
      },
    }
  );
};
