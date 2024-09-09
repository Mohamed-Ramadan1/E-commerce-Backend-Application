// system imports
import { Response, NextFunction } from "express";

// models imports
import PrimeSubscription from "../../models/primeMemberShip/primeSubscriptionModel";
import User from "../../models/user/userModel";

// interface imports
import {
  IPrimeSubScription,
  PrimeSubscriptionStatus,
} from "../../models/primeMemberShip/primeSubscription.interface";
import { IUser } from "../../models/user/user.interface";
import { PrimeSubscriptionRequest } from "../../RequestsInterfaces/primeSubscription/primeSubscriptionRequest.interface";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";

export const validateBeforeCancelMySubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user.isPrimeUser) {
      return next(new AppError("Your are not prime member.", 400));
    }

    if (!req.body.cancellationReason) {
      return next(new AppError("Please provide a cancellation reason.", 400));
    }

    const subscriptionInformation: IPrimeSubScription | null =
      await PrimeSubscription.findOne({
        _id: user.lastPrimeSubscriptionDocument,
        user,
      });
    if (!subscriptionInformation) {
      return next(
        new AppError(
          "Your information about your latest subscription could  not be found.",
          404
        )
      );
    }

    if (subscriptionInformation.status === PrimeSubscriptionStatus.CANCELLED) {
      return next(new AppError("Your subscription is already cancelled.", 400));
    }

    req.latestSubscription = subscriptionInformation;
  }
);
