import { NextFunction, Request, Response } from "express";
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import User, { IUser } from "../models/userModel";
import { createSendToken, createLogOutToken } from "../utils/createSendToken";

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

export const loginWithEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

// export const logout = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     createLogOutToken(req.user._id, 200, res);
//     res.status(200).json({
//       status: "success",
//     });
//   }
// );
