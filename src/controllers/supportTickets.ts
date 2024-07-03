// system imports
import { NextFunction, Response } from "express";

// models imports
import SupportTicket from "../models/supportTicketsModel";

//interface imports
import {
  AuthUserRequest,
  SupportTicketRequest,
  AuthUserRequestWithID,
} from "../shared-interfaces/request.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ISupportTicket } from "../models/supportTickets.interface";

// utils imports
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

// emails imports
import supportTicketReceivedConfirmationEmail from "../emails/admins/supportTicketRecivedConfirmationEmail";

export const getSupportTickets = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const supportTickets: ISupportTicket[] | null = await SupportTicket.find({
      user: req.user._id,
    });
    const response: ApiResponse<ISupportTicket[]> = {
      status: "success",
      results: supportTickets.length,
      data: supportTickets,
    };
    sendResponse(200, response, res);
  }
);
export const getSupportTicket = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const supportTicket: ISupportTicket | null = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!supportTicket) {
      return next(new AppError("Support Ticket not found", 404));
    }
    const response: ApiResponse<ISupportTicket> = {
      status: "success",
      data: supportTicket,
    };
    sendResponse(200, response, res);
  }
);

export const openSupportTicket = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
    const { subject, description, category } = req.body;
    const supportTicket: ISupportTicket = await SupportTicket.create({
      user: req.user._id,
      subject,
      description,
      category,
    });

    supportTicketReceivedConfirmationEmail(req.user, supportTicket);
    const response: ApiResponse<ISupportTicket> = {
      status: "success",
      data: supportTicket,
    };
    sendResponse(201, response, res);
  }
);

export const updateSupportTicket = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const supportTicket: ISupportTicket | null =
      await SupportTicket.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    if (!supportTicket) {
      return next(new AppError("Support Ticket not found", 404));
    }
    const response: ApiResponse<ISupportTicket> = {
      status: "success",
      data: supportTicket,
    };
    sendResponse(200, response, res);
  }
);

export const deleteSupportTicket = catchAsync(
  async (req: AuthUserRequestWithID, res: Response, next: NextFunction) => {
    const supportTicket: ISupportTicket | null =
      await SupportTicket.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });
    if (!supportTicket) {
      return next(new AppError("Support Ticket not found", 404));
    }
    const response: ApiResponse<ISupportTicket> = {
      status: "success",
      data: supportTicket,
    };
    sendResponse(200, response, res);
  }
);
