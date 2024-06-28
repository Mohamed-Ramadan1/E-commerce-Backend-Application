import catchAsync from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/ApplicationError";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { ResetPasswordRequest } from "../shared-interfaces/request.interface";
import { IUser } from "../models/user.interface";
import crypto from "crypto";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("You are not logged in! Please log in", 401));
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }
    if (user.active === false) {
      return next(
        new AppError(
          "Your account has been activated please contact support for more information.",
          401
        )
      );
    }
    req.user = user;
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
