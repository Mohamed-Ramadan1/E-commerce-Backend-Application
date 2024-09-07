// system imports
import { Response, NextFunction } from "express";

// models imports
import PrimeSubscription from "../../models/primeSubscription/primeSubscriptionModel";
// interface imports
import { IPrimeSubScription } from "../../models/primeSubscription/primeSubscription.interface";
import { PrimeSubscriptionRequest } from "../../shared-interfaces/primeSubscription/primeSubscriptionRequest.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

//  create subscription
export const createSubscription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

// get my  subscription

// rename subscription

// cancel my subscription
