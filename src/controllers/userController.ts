// system imports
import { promises as fs } from "fs";
import { NextFunction, Response } from "express";

// modules imports
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// models imports
import User from "../models/userModel";
import ShoppingCart from "../models/shoppingCartModel";

// interface imports
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IUser } from "../models/user.interface";

import {
  UserRequest,
  UserRequestWithUpdateInfo,
  UserUpdatePasswordRequest,
  UserWithUserDataRequest,
} from "../shared-interfaces/userRequest.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { cascadeUserDeletion } from "../utils/userUtils/deleteUserRelatedData";
import { createSendToken } from "../utils/createSendToken";
import { sendResponse } from "../utils/sendResponse";
import APIFeatures from "../utils/apiKeyFeature";

// admin operations

// get all users
export const getAllUsers = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users: IUser[] | null = await features.execute();
    const response: ApiResponse<IUser[]> = {
      status: "success",
      results: users.length,
      data: users,
    };
    sendResponse(200, response, res);
  }
);

// ger user
export const getUser = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findById(req.params.id);
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

// create new user account
export const createUser = catchAsync(
  async (req: UserWithUserDataRequest, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.create(req.body);
    if (!user) {
      return next(
        new AppError(
          "something went wrong during creating the user account .",
          400
        )
      );
    }
    await ShoppingCart.create({ user: user._id });
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(201, response, res);
  }
);

// update user data / information
export const updateUser = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
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

// delete existing user with all his data
export const deleteUser = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user: IUser | null = await User.findByIdAndDelete(req.params.id, {
        session,
      });

      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("User not found", 404));
      }

      // Delete all related data to the user
      await cascadeUserDeletion(user, session, next);

      await session.commitTransaction();
      session.endSession();

      const response: ApiResponse<null> = {
        status: "success",
        data: null,
      };
      sendResponse(204, response, res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Error occurred during user deletion", 500));
    }
  }
);

// activate user account
export const activateUser = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("No user exist with this id.", 404));
    }
    if (user.active) {
      return next(new AppError("User already activated", 400));
    }

    user.active = true;
    await user.save({ validateBeforeSave: false });

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

// un activate user account
export const deactivateUser = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("No user exist with this id.", 404));
    }
    if (!user.active) {
      return next(new AppError("User already deactivated", 400));
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

//-----------------------------------------------------------------------
// User Profile operations

// Update my account info not password (check if pass or conf pass exist return err else update )
export const updateMyInfo = catchAsync(
  async (req: UserRequestWithUpdateInfo, res: Response, next: NextFunction) => {
    const updatedObject = { ...req.body };
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);

      updatedObject.photo = response.secure_url;
      updatedObject.photoPublicId = response.public_id;
      if (req.user.photoPublicId) {
        await cloudinary.v2.uploader.destroy(req.user.photoPublicId);
      }
    }

    const user: IUser | null = await User.findByIdAndUpdate(
      req.user._id,
      updatedObject,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!user) {
      return next(new AppError("You are not authorized", 401));
    }
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(200, response, res);
  }
);

//update my account password
export const updateMyPassword = catchAsync(
  async (req: UserUpdatePasswordRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirmation } = req.body;

    const user = (await User.findById(req.user._id).select(
      "+password"
    )) as IUser;

    const isMatch: boolean = await user.comparePassword(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return next(new AppError("Current password is incorrect", 401));
    }

    // update data

    user.password = newPassword;
    user.passwordConfirmation = passwordConfirmation;
    await user.save();

    createSendToken(user, 200, res);
  }
);
// unActive my account
export const deactivateMe = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    req.user.active = false;
    await req.user.save({ validateBeforeSave: false });

    //create send logout token
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(200, response, res);
  }
);
//delete my account
export const deleteMe = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const me: IUser | null = await User.findByIdAndDelete(req.user._id, {
        session,
      });

      if (!me) {
        await session.abortTransaction();
        session.endSession();
        return next(new AppError("You are not authorized", 401));
      }

      // Delete all user-related data
      await cascadeUserDeletion(me, session, next);

      await session.commitTransaction();
      session.endSession();

      const response: ApiResponse<null> = {
        status: "success",
        data: null,
      };

      sendResponse(204, response, res);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError("Error occurred during account deletion", 500));
    }
  }
);

//get current logged in user
export const getMe = catchAsync(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const me: IUser | null = await User.findById(req.user._id);
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
