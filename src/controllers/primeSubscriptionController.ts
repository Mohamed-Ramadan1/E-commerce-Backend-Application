// system imports
import { Response, NextFunction } from "express";

// models imports
import PrimeSubscription from "../models/primeSubscriptionModel";

// interface imports
import { IPrimeSubScription } from "../models/primeSubscription.interface";
import { PrimeSubscriptionRequest } from "../shared-interfaces/primeSubscriptionRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import AppError from "../utils/ApplicationError";

// utils imports
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

//-----------------------------------------
// user routes
