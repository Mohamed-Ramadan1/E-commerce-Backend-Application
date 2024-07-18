// system imports
import { NextFunction, Response } from "express";

// models imports
import ShopSupportTicket from "../models/shopSupportTicketModal";
import Shop from "../models/shopModal";
import User from "../models/userModel";
// interface imports
import { IShopSupportTicket } from "../models/shopSupportTicket.interface";
import { ShopSupportTicketRequest } from "../shared-interfaces/shopSupportTicketRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IShop } from "../models/shop.interface";
// utils
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { IUser } from "../models/user.interface";

// validation middleware for validation before allowing user to create supportTickets
export const validateBeforeOpenShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    // check required data exist
    const { subject, description, category } = req.body;

    if (!subject || !description || !category) {
      return next(
        new AppError("Subject, Description and Category are required", 400)
      );
    }
    // validate user and validate shop exist.
    const userShop: IShop | null = await Shop.findOne({
      _id: req.user.myShop,
      owner: req.user._id,
    });
    if (!userShop) {
      return next(
        new AppError(
          "You don't have permission to create support ticket,only shopOwner allowed to use this route you can use user support tickets route instead.",
          403
        )
      );
    }
    req.shop = userShop;

    next();
  }
);

// validation middleware for validation before allowing admins to create supportTickets
export const validateBeforeCreateShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    // check required data exist
    // userId, shopId, subject, description, category
    const { subject, description, category, userId, shopId } = req.body;

    if (!subject || !description || !category || !userId || !shopId) {
      return next(
        new AppError(
          "Subject, Description , Category , UserId , ShopId are required",
          400
        )
      );
    }
    // validate user and validate shop exist.
    const userShop: IShop | null = await Shop.findOne({
      _id: shopId,
      owner: userId,
    });

    if (!userShop) {
      return next(
        new AppError(
          "No shop exits with this id and related to this user please check the data and try again.",
          403
        )
      );
    }
    // get user by the id and check if the user is exist
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      return next(new AppError("No user exits with this id", 403));
    }
    // check if the user has a shop
    if (!user.myShop) {
      return next(
        new AppError(
          "User doesn't have a shop, please check the data and try again.",
          403
        )
      );
    }

    // check if the user is the owner of the shop
    if (user.myShop.toString() !== userShop._id.toString()) {
      return next(
        new AppError(
          "User is not the owner of the shop, please check the data and try again.",
          403
        )
      );
    }

    req.shop = userShop;
    req.userToCreateTicket = user;
    next();
  }
);

// validation middleware for validation before process the support ticket
export const validateBeforeProcessShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    next();
  }
);
