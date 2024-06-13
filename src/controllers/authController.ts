import { NextFunction, Request, Response } from "express";
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
export const signUpWithEmail = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password, passwordConfirmation } =
      req.body;

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      passwordConfirmation,
    });

    createSendToken(user, 201, res);
  }
);

export const loginWithEmail = catchAsync(
  async (req: LoginRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = (await User.findOne({ email }).select(
      "+password"
    )) as IUser | null;
    if (!user || !(await (user as any).comparePassword(password))) {
      return next(new AppError("Email or password not correct ", 401));
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
