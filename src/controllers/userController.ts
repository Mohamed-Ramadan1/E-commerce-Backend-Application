import User from "../models/userModel";
import ShoppingCart from "../models/shoppingCartModel";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IUser } from "../models/user.interface";
import {
  RequestWithMongoDbId,
  RequestWithUser,
  AuthUserRequest,
  RequestUpdateUserPassword,
} from "../shared-interfaces/request.interface";
import { sendResponse } from "../utils/sendResponse";
import { createSendToken } from "../utils/createSendToken";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

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
    const user: IUser = await User.create(req.body);
    if (!user) {
      return next(new AppError("something went wrong", 400));
    }
    await ShoppingCart.create({ user: user._id });
    const response: ApiResponse<IUser> = {
      status: "success",
      data: user,
    };
    sendResponse(201, response, res);
  }
);

export const updateUser = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
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
export const updateMyInfo = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    if (
      req.body.password ||
      req.body.passwordConfirmation ||
      req.body.role ||
      req.body.verified ||
      req.body.active ||
      req.body.passwordResetToken ||
      req.body.passwordResetExpires ||
      req.body.emailToken
    ) {
      return next(
        new AppError("You can't preform this action using this route.", 400)
      );
    }

    const updatedObject = { ...req.body };
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      updatedObject.photo = response.secure_url;
      updatedObject.photoPublicId = response.public_id;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updatedObject, {
      new: true,
      runValidators: true,
    });
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
  async (req: RequestUpdateUserPassword, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirmation } = req.body;
    if (!currentPassword || !newPassword || !passwordConfirmation) {
      return next(
        new AppError(
          "Please provide all required data currentPassword, password, passwordConfirmation",
          400
        )
      );
    }
    // Check if the new password and confirmation password match
    if (newPassword !== passwordConfirmation) {
      return next(
        new AppError("Password and password confirmation do not match", 400)
      );
    }

    const user = await User.findById(req.user._id).select("+password");
    // now check if the current password is correct or not and based on the result update the password
    if (!user) {
      return next(new AppError("You are not authorized", 401));
    }
    const isMatch = await user.comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return next(new AppError("Current password is incorrect", 401));
    }
    user.password = newPassword;
    user.passwordConfirmation = passwordConfirmation;
    await user.save();

    createSendToken(user, 200, res);
  }
);
// unActive my account
export const deactivateMe = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new AppError("You are not authorized", 401));
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
//delete my account (with consedration fo delete other rleated data like wishlist items andB shoping cart )
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
