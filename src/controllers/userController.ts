import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

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

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
