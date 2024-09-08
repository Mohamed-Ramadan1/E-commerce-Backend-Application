// system imports
import { Response, NextFunction } from "express";

// models imports
import PrimeSubscription from "../../models/primeMemberShip/primeSubscriptionModel";
// interface imports
import {
  IPrimeSubScription,
  PrimeSubscriptionStatus,
} from "../../models/primeMemberShip/primeSubscription.interface";
import { PrimeSubscriptionRequest } from "../../shared-interfaces/primeSubscription/primeSubscriptionRequest.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import mongoose from "mongoose";

//  create subscription
export const createSubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    /* 
    user plan  amounts 
    
    
    */
  }
);

// get my  subscription
export const getMyLatestPrimeSubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    if (!req.user.lastPrimeSubscriptionDocument) {
      return next(
        new AppError(
          "Your information about your latest subscription could  not be found.",
          404
        )
      );
    }
    const subscription = await PrimeSubscription.findOne({
      user: req.user._id,
      _id: req.user.lastPrimeSubscriptionDocument,
    });

    if (!subscription) {
      return next(
        new AppError(
          "Your information about your latest subscription could  not be found.",
          404
        )
      );
    }

    sendResponse(200, { data: subscription }, res);
  }
);

// get all my subscriptions information
export const getAllPreviousSubscriptions = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      PrimeSubscription.find({ user: req.user }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const subscriptions: IPrimeSubScription[] = await features.execute();
    const response: ApiResponse<IPrimeSubScription[]> = {
      status: "success",
      results: subscriptions.length,
      data: subscriptions,
    };
    sendResponse(200, response, res);
  }
);

// rename subscription
export const renewMySubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {}
);

// cancel my subscription
export const cancelMySubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    const { user, latestSubscription } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      latestSubscription.status = PrimeSubscriptionStatus.CANCELLED;
      latestSubscription.cancellationDate = new Date();
      latestSubscription.cancellationReason = req.body.cancellationReason;
      await latestSubscription.save({ session });

      user.isPrimeUser = false;
      user.primeSubscriptionStatus = PrimeSubscriptionStatus.CANCELLED;
      await user.save({ validateBeforeSave: false, session });

      await session.commitTransaction();
      const response: ApiResponse<null> = {
        status: "success",
        message: "Your prime membership has been cancelled.",
      };
      sendResponse(200, response, res);
    } catch (err) {
      await session.abortTransaction();
      throw new AppError(
        "something went wrong during cancellation of your prime subscription",
        500
      );
    } finally {
      session.endSession();
    }
  }
);
