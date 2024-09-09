// system imports
import { Response, NextFunction } from "express";

// models imports

// interface imports
import { ApiResponse } from "../../RequestsInterfaces/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { ShopDiscountCodeRequest } from "../../RequestsInterfaces/discountCode/shopDiscountCodeRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

export const validateBeforeCreateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);
