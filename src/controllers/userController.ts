import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IUser } from "../models/user.interface";
import {
  RequestWithMongoDbId,
  RequestWithUser,
  AuthUserRequest,
} from "../shared-interfaces/request.interface";
import { sendResponse } from "../utils/sendResponse";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();
    const response: ApiResponse<IUser[]> = {
      status: "success",
      results: users.length,
      data: users,
    };
    sendResponse(200, response, res);
  }
);

export const getUser = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(200, response, res);
  }
);

export const createUser = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password, passwordConfirmation } =
      req.body;

    const user = await User.create(req.body);
    if (!user) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(201, response, res);
  }
);

export const updateUser = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(200, response, res);
  }
);

export const deleteUser = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);

// User Profile operations

// Update my account info not password (check if pass or conf pass exist return err else update )

//update my account password

// unActive my account
export const deactivateMe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.active = false;
    await user.save({ validateBeforeSave: false });

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);
//delete my account (with consedration fo delete other rleated data like wishlist items and shoping cart )
export const deleteMe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const me = await User.findById(req.user._id);

    if (!me) {
      return next(new AppError("Your not authorized ", 401));
    }

    await User.deleteOne({ _id: req.user._id });

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);
//get me
export const getMe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const me = await User.findById(req.user._id);
    if (!me) {
      return next(new AppError("Your not authorized ", 401));
    }
    const response: ApiResponse<IUser> = {
      status: "success",
      data: me as IUser,
    };
    sendResponse(200, response, res);
  }
);
