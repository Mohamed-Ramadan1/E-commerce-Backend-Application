// system imports
import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

// models imports
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import User from "../../models/user/userModel";

// interface imports
import { IUser } from "../../models/user/user.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";

import {
  SingUpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../shared-interfaces/authRequests.interface";
import { AuthUserRequest } from "../../shared-interfaces/request.interface";
// utils imports
import AppError from "../../utils/apiUtils/ApplicationError";
import catchAsync from "../../utils/apiUtils/catchAsync";
import {
  createSendToken,
  createLogOutToken,
} from "../../utils/apiUtils/createSendToken";

// emails imports
import sendVerificationMail from "../../emails/users/accountVerificationEmail";
import sendResetPasswordEmail from "../../emails/users/resetPasswordEmail";

export const signUpWithEmail = catchAsync(
  async (req: SingUpRequest, res: Response, next: NextFunction) => {
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

    user.shoppingCart = shoppingCart;
    // generate verification token and send it with the email and late the verification to the last stage
    const verificationToken: string = user.createEmailVerificationToken();
    user.emailVerificationToken = verificationToken;
    await user.save({ validateBeforeSave: false });

    sendVerificationMail(user);
    createSendToken(user, 201, res);
  }
);

// received the verification email and compare the one that inserted on the database
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

export const resetPassword = catchAsync(
  async (req: ResetPasswordRequest, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password, passwordConfirmation } = req.body;

    if (!password || !passwordConfirmation) {
      return next(
        new AppError("Please provide password and password confirmation", 400)
      );
    }

    if (password !== passwordConfirmation) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length < 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const resetToken = crypto.createHash("sha256").update(token).digest("hex");

    const user: IUser | null = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Invalid token or expired token", 400));
    }

    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message:
        "Password has been reset successfully please login with your new password",
    });
  }
);
