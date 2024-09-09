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

export const createDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const getDiscountCodes = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const getDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const updateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const deleteDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const activateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const disActivateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);

export const updateDiscountCodeEndDate = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {}
);
