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
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../shared-interfaces/request.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import sendVerificationMail from "../utils/confirmEmail";
import sendResetPasswordEmail from "../utils/resetPasswordEmail";
import crypto from "crypto";

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
    // genrate verficatin token and send it with the email and late the verfiication to the last stage
    const verificationToken: string = user.createEmailVerificationToken();
    user.emailVerificationToken = verificationToken;
    await user.save({ validateBeforeSave: false });

    sendVerificationMail(user);
    createSendToken(user, 201, res);
  }
);

// recieved the verification email and comapre the one that inserted on the database
export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const user: IUser | null = await User.findOne({
      emailVerificationToken: token,
    });
    if (!user) {
      return next(new AppError("Invalid token", 400));
    }
    user.emailVerificationToken = undefined;
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Your email has been verified",
    });
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

// tow function one for the reset password and one for the forogot funcitons
export const forgotPassword = catchAsync(
  async (req: ForgotPasswordRequest, res: Response, next: NextFunction) => {
    // get the email
    // search if it exists
    // if exists it will create the reset toekn and send it to the user email
    //if not return message say that no account exists for this email

    if (!req.body.email)
      return next(new AppError("Please provide an email", 400));

    const user: IUser | null = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("No account found for this email", 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    sendResetPasswordEmail(user, resetToken);
    res.status(200).json({
      status: "success",
      message: "Reset password email sent",
    });
  }
);

// export const resetPassword = catchAsync(
//   async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
//     const { token } = req.params;
//     const { password, passwordConfirmation } = req.body;

//     if (!password || !passwordConfirmation) {
//       return next(
//         new AppError("Please provide password and password confirmation", 400)
//       );
//     }

//     if (password !== passwordConfirmation) {
//       return next(new AppError("Passwords do not match", 400));
//     }

//     const user: IUser | null = await User.findOne({
//       passwordResetToken: token,
//       passwordResetExpires: { $gt: Date.now() },
//     });

//     console.log(user);
//     if (!user) {
//       return next(new AppError("Invalid token or expired token", 400));
//     }

//     user.password = req.body.password;
//     user.passwordConfirmation = req.body.passwordConfirmation;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();

//     res.status(200).json({
//       status: "success",
//       message:
//         "Password has been reset successfully please login with your new password",
//     });
//   }
// );
