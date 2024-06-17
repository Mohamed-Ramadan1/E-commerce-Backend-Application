import ShoppingCart from "../models/shoppingCartModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

// import CartItem from "../models/cartItemModel";
import { Request, Response, NextFunction } from "express";

import { AuthUserRequest } from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
export const checkoutWithStripe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    console.log("first");
  }
);

export const checkoutWithCash = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {}
);
