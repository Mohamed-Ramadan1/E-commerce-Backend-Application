import RefundRequest from "../models/refundModel";

import { IRefundRequest } from "../models/refund.interface";
import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
/*
-- create refund request
-- get all refund  requests (not-confirmed)
-- get refund request (not-confirmed)
-- delete refund request 
-- confirm refund request 
-- reject refund request 

-- get all refund requests (confirmed)
-- get refund request (confirmed)

*/

export const createRefundRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllRefundRequestsNotConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getRefundRequestNotConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteRefundRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const confirmRefundRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const rejectRefundRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllRefundRequestsConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getRefundRequestConfirmed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
