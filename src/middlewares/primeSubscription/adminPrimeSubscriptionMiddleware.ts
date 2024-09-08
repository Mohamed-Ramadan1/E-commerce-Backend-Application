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
import { AdminPrimeSubscriptionRequest } from "../../shared-interfaces/primeSubscription/adminPrimeSubscriptionRequest.interface";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";

const validateUserExisting = async (userId: string): Promise<IUser> => {
  const user: IUser | null = await User.findById(userId);
  if (!user) {
    throw new AppError("No user found with this id", 404);
  }
  return user;
};

const checkIfUserHasPrimeSubscription = async (
  user: IUser
): Promise<IPrimeSubScription | void> => {
  if (
    user.isPrimeUser &&
    user.primeSubscriptionStatus === PrimeSubscriptionStatus.ACTIVE
  ) {
    throw new AppError(
      "User already prime member and its state is active",
      400
    );
  }

  if (user.lastPrimeSubscriptionDocument) {
    const primeSubscription: IPrimeSubScription | null =
      await PrimeSubscription.findById(user.lastPrimeSubscriptionDocument);
    if (primeSubscription) {
      return primeSubscription;
    }
  }
};

const getLastPrimeSubscription = async (
  user: IUser
): Promise<IPrimeSubScription> => {
  if (
    !user.isPrimeUser ||
    user.primeSubscriptionStatus !== PrimeSubscriptionStatus.ACTIVE
  ) {
    throw new AppError("User is not an active prime member", 400);
  }

  if (!user.lastPrimeSubscriptionDocument) {
    throw new AppError(
      "User does not have a last prime subscription document",
      404
    );
  }

  const latestSubscription = await PrimeSubscription.findById(
    user.lastPrimeSubscriptionDocument
  );

  if (!latestSubscription) {
    throw new AppError(
      "No prime membership found matching the last subscription document ID",
      404
    );
  }

  return latestSubscription;
};
export const validateBeforeCreatePrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user = await validateUserExisting(req.body.userId);
    if (user.isPrimeUser) {
      return next(new AppError("User already prime member", 400));
    }
    const existPrevMemberShip = await checkIfUserHasPrimeSubscription(user);

    if (existPrevMemberShip) {
      req.prevPrimeSubscription = existPrevMemberShip;
    }
    req.userToSubscribe = user;
    next();
  }
);

export const validateBeforeCancelPrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const user = await validateUserExisting(req.body.userId);

    const existPrevMemberShip = await getLastPrimeSubscription(user);

    if (existPrevMemberShip) {
      if (existPrevMemberShip.status !== PrimeSubscriptionStatus.CANCELLED) {
        req.prevPrimeSubscription = existPrevMemberShip;
      } else {
        return next(new AppError("Member ship is already cancelled.", 400));
      }
    }

    if (req.prevPrimeSubscription === undefined) {
      return next(
        new AppError(
          "something went wrong while tray to get user last subscription information",
          500
        )
      );
    }
    req.userToSubscribe = user;
    next();
  }
);

export const validateBeforeRenewPrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {}
);
