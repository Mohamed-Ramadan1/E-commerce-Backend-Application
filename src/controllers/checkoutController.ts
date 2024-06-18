import ShoppingCart from "../models/shoppingCartModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import Order from "../models/orderModel";
// import CartItem from "../models/cartItemModel";
import { Request, Response, NextFunction } from "express";

import { AuthUserRequest } from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
export const checkoutWithStripe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    /*
    1-get the shopping cart of the user
    2- create the order from the shopping cart
    ** update the items that ordered in the shopping cart
    3-clear the shopping cart
    4- send the response
    */
  }
);

export const checkoutWithCash = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {}
);
