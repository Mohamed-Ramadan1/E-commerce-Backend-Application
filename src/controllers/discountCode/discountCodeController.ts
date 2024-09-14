// system imports
import { Response, NextFunction } from "express";

// models imports
import DiscountCode from "../../models/discountCode/discountCodeModel";

// interface imports
import { ApiResponse } from "../../RequestsInterfaces/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { DiscountCodeRequest } from "../../RequestsInterfaces/discountCode/discountCodeRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { IDiscountCode } from "../../models/discountCode/discountCode.interface";
import { applyCode } from "../../utils/discountCodeUtils/applyDIscountCode";
import { unApplyCode } from "../../utils/discountCodeUtils/unApplyDiscountCode";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";

// apply discount code
export const applyDiscountCode = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const { userShoppingCart, discountCode } = req;
    const updatedUserShoppingCart: IShoppingCart = await applyCode(
      discountCode,
      userShoppingCart
    );
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: updatedUserShoppingCart,
    };
    sendResponse(200, response, res);
  }
);
// un-apply discount code
export const unApplyDiscountCode = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const { userShoppingCart, discountCode } = req;

    const updatedUserShoppingCart: IShoppingCart = await unApplyCode(
      userShoppingCart
    );
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: updatedUserShoppingCart,
    };
    sendResponse(200, response, res);
  }
);

// validate discount code
export const checkDiscountCodeValidate = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      code: req.body.code,
    });
    if (!discountCode) {
      return next(new AppError("Invalid discount code", 400));
    }
    // check if discount code is expired or not  and if it is active or not
    let isExpired: boolean = discountCode.endDate < new Date();
    let isActive: boolean = discountCode.isActive;
    let outOfUsageLimit: boolean = false;
    if (discountCode.usageLimit) {
      outOfUsageLimit = discountCode.usageLimit <= discountCode.usageCount;
    }

    return res.status(200).json({
      status: "success",
      message: "Discount code information",

      data: {
        discountCode,
        isExpired,
        isActive,
        outOfUsageLimit,
      },
    });
  }
);
// get discount code information
export const getDiscountCodeInformation = catchAsync(
  async (req: DiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      code: req.body.code,
    });
    if (!discountCode) {
      return next(
        new AppError("No discount code found with this code name ", 404)
      );
    }

    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);
