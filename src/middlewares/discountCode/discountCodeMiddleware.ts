// system imports
import { Response, NextFunction } from "express";

// models imports
import DiscountCode from "../../models/discountCode/discountCodeModel";
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
// interface imports
import { ApiResponse } from "../../RequestsInterfaces/response.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { DiscountCodeRequest } from "../../RequestsInterfaces/discountCode/discountCodeRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import {
  DiscountCodeSource,
  IDiscountCode,
} from "../../models/discountCode/discountCode.interface";

// apply discount code

enum ErrorMessages {
  INVALID_DISCOUNT_CODE = "Invalid discount code",
  EXPIRED_OR_INACTIVE_DISCOUNT_CODE = "Discount code is expired or not active",
  OUT_OF_USAGE_LIMIT_DISCOUNT_CODE = "Discount code is out of the usage limit",
  NOT_ACTIVE_DISCOUNT_CODE = "Discount code is not active",
  EMPTY_SHOPPING_CART = "You can apply discount only after adding product to your shopping cart.",
  ONLY_ONE_DISCOUNT_CODE = "You can apply only one discount code at a time",
  NO_DISCOUNT_CODE_USED = "You have not applied any discount code yet",
}

// validation for discount code existence and status (active, expired, usage limit)
const validateDiscountCode = async (
  req: DiscountCodeRequest
): Promise<IDiscountCode> => {
  const discountCode: IDiscountCode | null = await DiscountCode.findOne({
    code: req.body.code,
  });
  if (!discountCode) {
    throw new AppError(ErrorMessages.INVALID_DISCOUNT_CODE, 400);
  }
  // check if discount code is expired or not  and if it is active or not
  let isExpired: boolean = discountCode.endDate < new Date();
  let isActive: boolean = discountCode.isActive;
  let outOfUsageLimit: boolean = false;
  if (discountCode.usageLimit) {
    outOfUsageLimit = discountCode.usageLimit <= discountCode.usageCount;
  }
  if (!isActive) {
    throw new AppError(ErrorMessages.NOT_ACTIVE_DISCOUNT_CODE, 400);
  }
  if (isExpired) {
    throw new AppError(ErrorMessages.EXPIRED_OR_INACTIVE_DISCOUNT_CODE, 400);
  }
  if (outOfUsageLimit) {
    throw new AppError(ErrorMessages.OUT_OF_USAGE_LIMIT_DISCOUNT_CODE, 400);
  }
  return discountCode;
};

const validateUserShoppingCart = async (
  req: DiscountCodeRequest
): Promise<IShoppingCart> => {
  const userShoppingCart: IShoppingCart | null = await ShoppingCart.findById(
    req.user.shoppingCart
  );
  if (!userShoppingCart) {
    throw new AppError("something went wrong", 400);
  }
  if (userShoppingCart.total_price === 0) {
    throw new AppError(ErrorMessages.EMPTY_SHOPPING_CART, 400);
  }
  if (userShoppingCart.discount_code !== undefined) {
    throw new AppError(ErrorMessages.ONLY_ONE_DISCOUNT_CODE, 400);
  }
  return userShoppingCart;
};
export const validateBeforeApplyDiscountCode = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode = await validateDiscountCode(req);

    const userShoppingCart: IShoppingCart = await validateUserShoppingCart(req);

    req.discountCode = discountCode;
    req.userShoppingCart = userShoppingCart;

    next();
  }
);

export const validateBeforeUnApplyDiscountCode = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const userShoppingCart: IShoppingCart | null = await ShoppingCart.findById(
      req.user.shoppingCart
    );
    if (!userShoppingCart) {
      throw new AppError("something went wrong", 400);
    }
    if (userShoppingCart.discount_code === undefined) {
      throw new AppError(ErrorMessages.NO_DISCOUNT_CODE_USED, 400);
    }
    req.userShoppingCart = userShoppingCart;
    req.discountCode = userShoppingCart.discount_code;
    next();
  }
);
