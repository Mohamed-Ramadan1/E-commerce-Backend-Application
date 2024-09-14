import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import AppError from "../apiUtils/ApplicationError";
export const unApplyCode = async (userShoppingCart: IShoppingCart) => {
  try {
    if (userShoppingCart.discount_code_amount !== undefined) {
      userShoppingCart.total_price += userShoppingCart.discount_code_amount;
      userShoppingCart.total_discount -= userShoppingCart.discount_code_amount;
      userShoppingCart.discount_code_amount = undefined;
      userShoppingCart.discount_code_applied = false;
      userShoppingCart.discount_code = undefined;
    }

    const updatedUserShoppingCart = await userShoppingCart.save();
    return updatedUserShoppingCart;
  } catch (error) {
    throw new AppError("Failed to un-Apply discount code", 500);
  }
};
