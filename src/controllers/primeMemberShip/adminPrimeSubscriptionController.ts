// system imports
import { Response, NextFunction } from "express";
import mongoose from "mongoose";

// models imports
import User from "../../models/user/userModel";
import PrimeSubscription from "../../models/primeMemberShip/primeSubscriptionModel";

// interface imports
import {
  IPrimeSubScription,
  PrimeSubscriptionPaymentMethod,
  PrimeSubscriptionPlan,
  PrimeSubscriptionStatus,
} from "../../models/primeMemberShip/primeSubscription.interface";
import { AdminPrimeSubscriptionRequest } from "../../shared-interfaces/primeSubscription/adminPrimeSubscriptionRequest.interface";

import { ApiResponse } from "../../shared-interfaces/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

// config imports
import { SUBSCRIPTION_PLANS } from "../../config/subscription.config";

// email imports
import welcomePrimeMemberShipEmail from "../../emails/primeSubscriptions/welcomePrimeMemberShipEmail";
import sendCancellationEmail from "../../emails/primeSubscriptions/sendCancellationEmail";

//------------------------------------------
// admin routes
// get all prime subscription
export const getAllPrimeSubscriptions = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const features = new APIFeatures(PrimeSubscription.find(), req.query);
    const primeSubscriptions: IPrimeSubScription[] = await features.execute();
    const response: ApiResponse<IPrimeSubScription[]> = {
      status: "success",
      results: primeSubscriptions.length,
      data: primeSubscriptions,
    };
    sendResponse(200, response, res);
  }
);

// get prime subscription by id
export const getPrimeSubscriptionById = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const primeSubscription: IPrimeSubScription | null =
      await PrimeSubscription.findById(req.params.id);

    if (!primeSubscription) {
      return next(
        new AppError("No prime subscription found with this id.", 404)
      );
    }
    const response: ApiResponse<IPrimeSubScription> = {
      status: "success",
      data: primeSubscription,
    };
    sendResponse(200, response, res);
  }
);

// update prime subscription
export const updatePrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const primeSubscription: IPrimeSubScription | null =
      await PrimeSubscription.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

    if (!primeSubscription) {
      return next(
        new AppError("No prime subscription found with this id.", 404)
      );
    }
    const response: ApiResponse<IPrimeSubScription> = {
      status: "success",
      data: primeSubscription,
    };
    sendResponse(200, response, res);
  }
);

// delete  user prime subscription
export const deletePrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const primeSubscription = await PrimeSubscription.findByIdAndDelete(
          req.params.id,
          { session }
        );

        if (!primeSubscription) {
          throw new AppError("No prime subscription found with this id.", 404);
        }

        const userWithSubscription = await User.findByIdAndUpdate(
          primeSubscription.user,
          {
            $unset: {
              primeSubscriptionStatus: "",
              lastPrimeSubscriptionDocument: undefined,
            },
            $set: { isPrimeUser: false },
          },
          {
            session,
            new: true,
            runValidators: true,
          }
        );

        if (!userWithSubscription) {
          throw new AppError(
            "Something went wrong while deleting user prime subscription",
            404
          );
        }
      });

      const response: ApiResponse<IPrimeSubScription> = {
        status: "success",
        message: "Prime subscription successfully deleted",
      };
      sendResponse(200, response, res);
    } catch (error) {
      console.error("Error in deletePrimeSubscription:", error);
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError("Error while deleting prime subscription", 500));
    } finally {
      await session.endSession();
    }
  }
);
// create primeSubscription
export const createPrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { userToSubscribe } = req;

      const newPrimeSubscription: IPrimeSubScription = new PrimeSubscription({
        user: userToSubscribe,
        nextBillingDate: new Date(
          new Date().setDate(new Date().getDate() + 30)
        ),
        startDate: new Date().setDate(new Date().getDate()),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: PrimeSubscriptionStatus.ACTIVE,

        plan: PrimeSubscriptionPlan.MONTHLY,
        originalSubscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].originalAmount,
        discountedSubscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].discountedAmount,
        subscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].originalAmount -
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].discountedAmount,
        paymentMethod: PrimeSubscriptionPaymentMethod.PAYED_BY_ADMIN,
      });

      // check if the user have previously prime  subscription  to set the last Billing Date
      if (req.prevPrimeSubscription !== undefined) {
        newPrimeSubscription.lastBillingDate =
          req.prevPrimeSubscription.createdAt;
      }

      const savedSubscription = await newPrimeSubscription.save({ session });

      userToSubscribe.isPrimeUser = true;
      userToSubscribe.primeSubscriptionStatus = PrimeSubscriptionStatus.ACTIVE;
      userToSubscribe.lastPrimeSubscriptionDocument = savedSubscription._id;
      await userToSubscribe.save({ validateBeforeSave: false, session });

      // commit the  transaction and end the session
      await session.commitTransaction();

      welcomePrimeMemberShipEmail(userToSubscribe, newPrimeSubscription);
      const response: ApiResponse<IPrimeSubScription> = {
        status: "success",
        data: newPrimeSubscription,
      };
      sendResponse(201, response, res);
    } catch (err) {
      console.error(err);
      session.abortTransaction();
      session.endSession();
      throw new AppError("Error while creating prime subscription", 500);
    } finally {
      session.endSession();
    }
  }
);

// cancel prime subscription
export const cancelPrimeSubscription = catchAsync(
  async (
    req: AdminPrimeSubscriptionRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { userToSubscribe, prevPrimeSubscription } = req;

    if (prevPrimeSubscription === undefined) {
      return next(
        new AppError(
          "something went wrong while tray to get user last subscription information",
          500
        )
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      prevPrimeSubscription.status = PrimeSubscriptionStatus.CANCELLED;
      prevPrimeSubscription.cancellationDate = new Date();

      if (req.body.cancellationReason !== undefined) {
        prevPrimeSubscription.cancellationReason = req.body.cancellationReason;
      }

      await prevPrimeSubscription.save({ session });
      userToSubscribe.isPrimeUser = false;
      userToSubscribe.primeSubscriptionStatus =
        PrimeSubscriptionStatus.CANCELLED;

      await userToSubscribe.save({ validateBeforeSave: false, session });

      // commit the  transaction
      await session.commitTransaction();

      //send email for cancellation confirmation
      sendCancellationEmail(userToSubscribe, prevPrimeSubscription);

      const response: ApiResponse<IPrimeSubScription> = {
        status: "success",
        message: "prime subscription successfully cancelled ",
      };
      sendResponse(200, response, res);
    } catch (error) {
      console.error(error);
      session.abortTransaction();
      session.endSession();
      throw new AppError("Error while cancelling prime subscription", 500);
    } finally {
      session.endSession();
    }
  }
);
