import {
  IDiscountCode,
  DiscountType,
} from "../../models/discountCode/discountCode.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import AppError from "../apiUtils/ApplicationError";

export const applyCode = async (
  discountCode: IDiscountCode,
  userShoppingCart: IShoppingCart
) => {
  try {
    // if the discount code with percentage  value

    if (discountCode.discountType === DiscountType.PERCENTAGE) {
      const discountAmount =
        (discountCode.discountValue / 100) * userShoppingCart.total_price;
      userShoppingCart.total_discount += discountAmount;
      userShoppingCart.total_price -= discountAmount;
      userShoppingCart.discount_code_applied = true;
      userShoppingCart.discount_code_amount = discountAmount;
      userShoppingCart.discount_code = discountCode;
    }
    // if the discount code with fixed amount value
    if (discountCode.discountType === DiscountType.FIXEDAMOUNT) {
      userShoppingCart.total_discount += discountCode.discountValue;
      userShoppingCart.total_price -= discountCode.discountValue;
      userShoppingCart.discount_code_applied = true;
      userShoppingCart.discount_code_amount = discountCode.discountValue;
      userShoppingCart.discount_code = discountCode;
    }

    if (discountCode.usageLimit !== undefined) {
      discountCode.usageCount++;
      if (discountCode.usageCount >= discountCode.usageLimit) {
        discountCode.isActive = false;
      }
      await discountCode.save();
    }

    const updatedShoppingCart = await userShoppingCart.save();
    return updatedShoppingCart;
  } catch (error) {
    throw new AppError("Failed to apply discount code", 500);
  }
};
