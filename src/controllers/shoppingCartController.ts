import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import {
  AuthUserRequest,
  RequestWithProductAndUser,
} from "../shared-interfaces/request.interface";

export const getShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {}
);

export const addItemToShoppingCart = catchAsync(
  async (
    req: RequestWithProductAndUser,
    res: Response,
    next: NextFunction
  ) => {}
);
export const removeItemFromShoppingCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const clearShoppingCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
