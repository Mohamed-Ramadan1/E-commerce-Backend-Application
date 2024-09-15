import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { IUser } from "../../models/user/user.interface";
import AppError from "../apiUtils/ApplicationError";
import mongoose from "mongoose";

export const createAndAssignShoppingCart = async (user: IUser) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const shoppingCart: IShoppingCart = new ShoppingCart({
      user: user._id,
    });
    await shoppingCart.save({ session });

    user.shoppingCart = shoppingCart;
    await user.save({ validateBeforeSave: false, session });

    await session.commitTransaction();
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    throw new AppError("Error while creating shopping cart for user", 500);
  } finally {
    session.endSession();
  }
};
