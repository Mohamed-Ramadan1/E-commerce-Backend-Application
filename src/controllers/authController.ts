import { NextFunction, Request, Response } from "express";
import ShoppingCart from "../models/shoppingCartModel";
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import { IUser } from "../models/user.interface";
import { createSendToken, createLogOutToken } from "../utils/createSendToken";
import {
  LoginRequest,
  AuthUserRequest,
  RequestWithUser,
} from "../shared-interfaces/request.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import sendVerificationMail from "../utils/confirmEmail";

export const signUpWithEmail = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password, passwordConfirmation } =
      req.body;

    const user: IUser | null = await User.create({
      name,
      email,
      phoneNumber,
      password,
      passwordConfirmation,
    });

    if (!user) {
      return next(new AppError("Fail to sign the new user  ", 500));
    }
    const shoppingCart: IShoppingCart = await ShoppingCart.create({
      user: user._id,
    });

    user.shoppingCart = shoppingCart._id;

    await user.save({ validateBeforeSave: false });
    sendVerificationMail(user);
    createSendToken(user, 201, res);
  }
);

export const loginWithEmail = catchAsync(
  async (req: LoginRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email }).select(
      "+password"
    );

    if (
      !user ||
      !(await (user as any).comparePassword(password, user.password))
    ) {
      return next(new AppError("Email or password not correct ", 401));
    }
    if (user.active === false) {
      return next(
        new AppError(
          "Your account has been un activate  contact support to know more information",
          401
        )
      );
    }
    createSendToken(user, 200, res);
  }
);

export const logout = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("No user logged in", 401));
    }
    createLogOutToken(req.user, 200, res);
  }
);
