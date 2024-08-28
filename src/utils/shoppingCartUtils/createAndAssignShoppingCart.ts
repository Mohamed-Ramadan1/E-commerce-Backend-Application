import User from "../../models/userModel";
import ShoppingCart from "../../models/shoppingCartModel";
import { IShoppingCart } from "../../models/shoppingCart.interface";
import { IUser } from "../../models/user.interface";
import AppError from "../ApplicationError";
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
