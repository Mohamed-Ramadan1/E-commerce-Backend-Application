// system imports
import { NextFunction, Response } from "express";

// models imports
import ProcessedSupportTicket from "../models/processedSupportTicketsModal";
import SupportTicket from "../models/supportTicketsModel";
import User from "../models/userModel";

//interface imports

import { SupportTicketRequest } from "../shared-interfaces/supportTicketsRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { ISupportTicket } from "../models/supportTickets.interface";
import { IUser } from "../models/user.interface";
import { IProcessedSupportTickets } from "../models/processedSupportTickets.Interface";

// utils imports
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

// emails imports
import supportTicketReceivedConfirmationEmail from "../emails/admins/supportTicketRecivedConfirmationEmail";
import sendSupportTicketResponseEmail from "../emails/users/userSupportTicketResponseEmail";

//---------
// Helper functions

// create processed support ticket document and delete the original document.
const handelProcessedSupportTicket = async (
  user: IUser,
  supportTicket: ISupportTicket
) => {
  const processedSupportTicket: IProcessedSupportTickets =
    await ProcessedSupportTicket.create({
      user,
      subject: supportTicket.subject,
      description: supportTicket.description,
      category: supportTicket.category,
      status: supportTicket.status,
      processedBy: {
        user: supportTicket.processedBy.user,
        name: supportTicket.processedBy.name,
        email: supportTicket.processedBy.email,
        phoneNumber: supportTicket.processedBy.phoneNumber,
        role: supportTicket.processedBy.role,
      },
      ticketCreatedDate: supportTicket.createdAt,
      ticketLastUpdatedDate: supportTicket.updatedAt,
      ticketProcessedDate: supportTicket.ticketProcessedDate,
      ticketResponse: supportTicket.ticketResponse,
    });

  if (!processedSupportTicket) {
    return;
  }
  await SupportTicket.findByIdAndDelete(supportTicket._id);
};

//-------------------------------------
// create / open new support ticket.
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

//------------------------------
// Admin controllers

// get all support tickets
export const getSupportTickets = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
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

// get support ticket by id
export const getSupportTicket = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
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

// create / open new support ticket.
export const createSupportTicket = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
    const { subject, description, category, userId } = req.body;

    const user: IUser | null = await User.findById(userId);
    if (!user) {
      return next(
        new AppError(
          "User you tray to create support ticket for is not exist please provide a valid user id.",
          404
        )
      );
    }
    const supportTicket: ISupportTicket = await SupportTicket.create({
      user: user._id,
      subject,
      description,
      category,
    });

    supportTicketReceivedConfirmationEmail(user, supportTicket);
    const response: ApiResponse<ISupportTicket> = {
      status: "success",
      data: supportTicket,
    };
    sendResponse(201, response, res);
  }
);

// update support ticket.
export const updateSupportTicket = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
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

// delete support ticket.
export const deleteSupportTicket = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
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

// process the support ticket
export const supportTicketResponse = catchAsync(
  async (req: SupportTicketRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { ticketResponse } = req.body;
    if (!ticketResponse) {
      return next(new AppError("Please provide a response", 400));
    }
    const supportTicket: ISupportTicket | null = await SupportTicket.findById(
      id
    );

    if (!supportTicket) {
      return next(new AppError("No support ticket found with this id.", 404));
    }
    const supportTicketOwner: IUser | null = await User.findById(
      supportTicket.user
    );
    if (!supportTicketOwner) {
      return next(
        new AppError(
          "User who open this support ticket is no longer exist.",
          404
        )
      );
    }

    // update support ticket data.
    supportTicket.status = "closed";
    supportTicket.processedBy = {
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
    };
    supportTicket.ticketProcessedDate = new Date();
    supportTicket.ticketResponse = ticketResponse;

    // save the updated document data
    const updatedSupportTicket = await supportTicket.save();

    // send response email to the user.
    sendSupportTicketResponseEmail(
      supportTicketOwner,
      updatedSupportTicket,
      ticketResponse
    );

    // generate processed support ticket and delete the original ticket document.
    handelProcessedSupportTicket(supportTicketOwner, updatedSupportTicket);
    // create response object
    const response: ApiResponse<null> = {
      status: "success",
      message: "Support Ticket response sent successfully",
    };
    sendResponse(200, response, res);
  }
);
