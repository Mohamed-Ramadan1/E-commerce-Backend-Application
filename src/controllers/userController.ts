import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

export const createUser = catchAsync(
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
    if (!user) {
      return next(new AppError("something went wrong", 400));
    }
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);
