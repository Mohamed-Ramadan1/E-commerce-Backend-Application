// system imports
import { Response, NextFunction } from "express";

// models imports
import PrimeSubscription from "../../models/primeSubscription/primeSubscriptionModel";
// interface imports
import { IPrimeSubScription } from "../../models/primeSubscription/primeSubscription.interface";
import { PrimeSubscriptionRequest } from "../../shared-interfaces/primeSubscriptionRequest.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

//-----------------------------------------
// user routes
