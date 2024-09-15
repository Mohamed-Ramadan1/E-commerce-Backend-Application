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
import { PrimeSubscriptionRequest } from "../../requestsInterfaces/primeSubscription/primeSubscriptionRequest.interface";

import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
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
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});
export const createUserPrimeSubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { user } = req;
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Create a Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].originalAmount,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          userId: user._id.toString(),
          subscriptionPlan: PrimeSubscriptionPlan.MONTHLY,
        },
      });

      const newPrimeSubscription: IPrimeSubScription = new PrimeSubscription({
        user: user._id,
        nextBillingDate: new Date(
          new Date().setDate(new Date().getDate() + 30)
        ),
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: PrimeSubscriptionStatus.PENDING,
        plan: PrimeSubscriptionPlan.MONTHLY,
        originalSubscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].originalAmount,
        discountedSubscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].discountedAmount,
        subscriptionAmount:
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].originalAmount -
          SUBSCRIPTION_PLANS[PrimeSubscriptionPlan.MONTHLY].discountedAmount,
        paymentMethod: PrimeSubscriptionPaymentMethod.STRIPE,
        stripePaymentIntentId: paymentIntent.id,
      });

      const savedSubscription = await newPrimeSubscription.save({ session });

      user.isPrimeUser = false; // Will be set to true after payment confirmation
      user.primeSubscriptionStatus = PrimeSubscriptionStatus.PENDING;
      user.lastPrimeSubscriptionDocument = savedSubscription._id;
      await user.save({ validateBeforeSave: false, session });

      await session.commitTransaction();

      const response = {
        status: "success",
        data: {
          clientSecret: paymentIntent.client_secret,
          subscriptionId: savedSubscription._id,
        },
      };
      sendResponse(201, response, res);
    } catch (err) {
      console.error(err);
      await session.abortTransaction();
      throw new AppError("Error while creating prime subscription", 500);
    } finally {
      session.endSession();
    }
  }
);

export const confirmPrimeSubscription = catchAsync(
  async (req: PrimeSubscriptionRequest, res: Response, next: NextFunction) => {
    const { paymentIntentId } = req.body;
    const { user } = req;

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const subscription = await PrimeSubscription.findOne({
      user: user._id,
      stripePaymentIntentId: paymentIntentId,
      status: PrimeSubscriptionStatus.PENDING,
    });

    if (!subscription) {
      throw new AppError("Subscription not found or already processed", 404);
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      throw new AppError("Payment not successful", 400);
    }

    subscription.status = PrimeSubscriptionStatus.ACTIVE;
    await subscription.save();

    user.isPrimeUser = true;
    user.primeSubscriptionStatus = PrimeSubscriptionStatus.ACTIVE;
    await user.save({ validateBeforeSave: false });

    // Send welcome email or perform other post-subscription actions here
    welcomePrimeMemberShipEmail(user, subscription);
    const response = {
      status: "success",
      message: "Prime subscription activated successfully",
    };
    sendResponse(200, response, res);
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
      sendCancellationEmail(user, latestSubscription);
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
