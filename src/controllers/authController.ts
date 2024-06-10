import { NextFunction, Request, Response } from "express";
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import User from "../models/userModel";
import { createSendToken } from "../utils/createSendToken";

export const signUpWithEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

export const signUpWithGoogle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const loginWithEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const loginWithFacebook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
