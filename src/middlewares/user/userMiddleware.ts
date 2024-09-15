// system imports
import { NextFunction, Response } from "express";

import {
  UserRequestWithUpdateInfo,
  UserUpdatePasswordRequest,
} from "../../requestsInterfaces/user/userRequest.interface";

// utils imports
import AppError from "../../utils/apiUtils/ApplicationError";
import catchAsync from "../../utils/apiUtils/catchAsync";

export const validateBeforeUpdateUserPassword = catchAsync(
  async (req: UserUpdatePasswordRequest, res: Response, next: NextFunction) => {
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

    next();
  }
);

export const validateBeforeUpdateUserInfo = catchAsync(
  async (req: UserRequestWithUpdateInfo, res: Response, next: NextFunction) => {
    const forbiddenFields = [
      "password",
      "passwordConfirmation",
      "role",
      "verified",
      "active",
      "passwordResetToken",
      "passwordResetExpires",
      "emailToken",
      "giftCard",
      "myShop",
    ];

    const attemptedUpdates = Object.keys(req.body);
    const invalidUpdates = attemptedUpdates.filter((field) =>
      forbiddenFields.includes(field)
    );

    if (invalidUpdates.length > 0) {
      return next(
        new AppError(
          `You can't update these fields: ${invalidUpdates.join(", ")}`,
          400
        )
      );
    }

    next();
  }
);
