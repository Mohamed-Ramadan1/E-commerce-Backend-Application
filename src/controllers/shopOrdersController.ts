// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";

// utils imports
import catchAsync from "../utils/catchAsync";

// emails imports
export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// this need some work
