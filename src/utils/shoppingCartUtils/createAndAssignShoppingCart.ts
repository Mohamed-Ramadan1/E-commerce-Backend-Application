import User from "../../models/user/userModel";
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { IUser } from "../../models/user/user.interface";
import AppError from "../apiUtils/ApplicationError";
export const createAndAssignShoppingCart = async (user: IUser) => {
  try {
    const shoppingCart: IShoppingCart = await ShoppingCart.create({
      user: user._id,
    });
    user.shoppingCart = shoppingCart;
    await user.save();
  } catch (err) {
    throw new AppError("Error while creating shopping cart for user", 500);
  }
};
