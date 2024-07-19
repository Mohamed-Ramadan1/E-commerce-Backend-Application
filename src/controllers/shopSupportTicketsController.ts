// system imports
import { NextFunction, Response } from "express";
import { promises as fs } from "fs";

// modules imports
import cloudinary from "cloudinary";
import { Schema } from "mongoose";
// models imports
import ShopSupportTicket from "../models/shopSupportTicketModal";

// interface imports
import { IShopSupportTicket } from "../models/shopSupportTicket.interface";
import { ShopSupportTicketRequest } from "../shared-interfaces/shopSupportTicketRequest.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";

// utils
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

// emails imports
import sendShopSupportTicketReceivedEmail from "../emails/shop/shopSupportTicketRecivedConfirmationEmail";
import sendShopSupportTicketProcessedEmail from "../emails/shop/shopSupportTicketResponseEmail";

//----------------------------------------------
//Helper Functions and types

// type for the ticket data object
type TicketObjectData = {
  shop: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  category: string;
  img?: string;
  imgPublicId?: string;
};

// type for the update ticket data object
type TicketUpdateObjectData = {
  subject?: string;
  description?: string;
  category?: string;
  status?: string;
  img?: string;
  imgPublicId?: string;
};

//----------------------------------------------
// Users Routes Handler
export const openShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const { subject, description, category } = req.body;
    const user = req.user._id;
    const shop = req.shop._id;

    const ticketData: TicketObjectData = {
      subject,
      description,
      category,
      user,
      shop,
    };
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      ticketData.img = response.secure_url;
      ticketData.imgPublicId = response.public_id;
    }
    const ticket: IShopSupportTicket = await ShopSupportTicket.create(
      ticketData
    );

    // sending received ticket confirmation email to user.
    sendShopSupportTicketReceivedEmail(req.shop, req.user, ticket);

    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: ticket,
    };
    sendResponse(201, response, res);
  }
);

// get all tickets for a shop
export const getMyShopSupportTickets = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const tickets: IShopSupportTicket[] = await ShopSupportTicket.find({
      shop: req.user.myShop,
    });

    const response: ApiResponse<IShopSupportTicket[]> = {
      status: "success",
      results: tickets.length,
      data: tickets,
    };
    sendResponse(200, response, res);
  }
);

// get a ticket for a shop
export const getMyShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const ticket: IShopSupportTicket | null = await ShopSupportTicket.findOne({
      shop: req.user.myShop,
      _id: req.params.ticketId,
    });

    if (!ticket) {
      return next(new AppError("Ticket not found", 404));
    }

    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: ticket,
    };
    sendResponse(200, response, res);
  }
);
// update a ticket for a shop
export const updateMyShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    // check the comming data and based of if result add them
    // check if the file and if do cloudinary upload and delete the old one then add the udpated to the data object
    // update the ticket with the new data object
    // send the response back with the updated ticket

    // extract body data
    const { subject, description, category } = req.body;

    // create ticket data object based on the prev type.
    const ticketData: TicketUpdateObjectData = {};

    // chack exist data and add based on the condetion result.
    if (subject) ticketData.subject = subject;
    if (description) ticketData.description = description;
    if (category) ticketData.category = category;

    // if there img file upload it to the cloudinary and set the img and imgPublicId to the ticketData object.
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      ticketData.img = response.secure_url;
      ticketData.imgPublicId = response.public_id;
    }
    // find and update the ticket with the new data object.
    const updatedTicket: IShopSupportTicket | null =
      await ShopSupportTicket.findOneAndUpdate(
        { _id: req.params.ticketId, user: req.user._id },
        ticketData,
        { new: true, runValidators: true }
      );

    // check if the ticket not found with this id.
    if (!updatedTicket) {
      return next(new AppError("Ticket not found with this id", 404));
    }

    // send the response back with the updated ticket.
    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: updatedTicket,
    };
    sendResponse(200, response, res);
  }
);

// delete a ticket for a shop
export const deleteMyShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const ticket: IShopSupportTicket | null =
      await ShopSupportTicket.findOneAndDelete({
        shop: req.user.myShop,
        _id: req.params.ticketId,
      });

    if (!ticket) {
      return next(new AppError("Ticket not found with this id", 404));
    }

    if (ticket.imgPublicId) {
      await cloudinary.v2.uploader.destroy(ticket.imgPublicId);
    }

    const response: ApiResponse<null> = {
      status: "success",
      message: "Ticket deleted successfully",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

//----------------------------------------------
// Admin Routes Handler
export const createShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const { subject, description, category, userId, shopId } = req.body;

    const ticketData: TicketObjectData = {
      subject,
      description,
      category,
      user: req.userToCreateTicket._id,
      shop: req.shop._id,
    };

    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      ticketData.img = response.secure_url;
      ticketData.imgPublicId = response.public_id;
    }

    const ticket: IShopSupportTicket = await ShopSupportTicket.create(
      ticketData
    );

    // sending received ticket confirmation email to user.
    sendShopSupportTicketReceivedEmail(
      req.shop,
      req.userToCreateTicket,
      ticket
    );

    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: ticket,
    };
    sendResponse(201, response, res);
  }
);
// get all shops tickets
export const getShopSupportTickets = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const tickets: IShopSupportTicket[] = await ShopSupportTicket.find();

    const response: ApiResponse<IShopSupportTicket[]> = {
      status: "success",
      results: tickets.length,
      data: tickets,
    };
    sendResponse(200, response, res);
  }
);

// get a shop ticket by id.
export const getShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const ticket: IShopSupportTicket | null = await ShopSupportTicket.findById(
      req.params.ticketId
    );

    if (!ticket) {
      return next(new AppError("Ticket not found", 404));
    }

    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: ticket,
    };
    sendResponse(200, response, res);
  }
);

// update shop support ticket by id.
export const updateShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    // extract body data
    const { subject, description, category, status } = req.body;

    // create ticket data object based on the prev type.
    const ticketData: TicketUpdateObjectData = {};

    // chack exist data and add based on the condetion result.
    if (subject) ticketData.subject = subject;
    if (description) ticketData.description = description;
    if (category) ticketData.category = category;
    if (status) ticketData.status = status;

    // if there img file upload it to the cloudinary and set the img and imgPublicId to the ticketData object.
    if (req.file) {
      const response = await cloudinary.v2.uploader.upload(req.file.path);
      await fs.unlink(req.file.path);
      ticketData.img = response.secure_url;
      ticketData.imgPublicId = response.public_id;
    }
    // find and update the ticket with the new data object.
    const updatedTicket: IShopSupportTicket | null =
      await ShopSupportTicket.findByIdAndUpdate(
        req.params.ticketId,
        ticketData,
        { new: true, runValidators: true }
      );

    // check if the ticket not found with this id.
    if (!updatedTicket) {
      return next(new AppError("Ticket not found with this id", 404));
    }

    // send the response back with the updated ticket.
    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: updatedTicket,
    };
    sendResponse(200, response, res);
  }
);
// delete a shop ticket by id.
export const deleteShopSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    const ticket: IShopSupportTicket | null =
      await ShopSupportTicket.findByIdAndDelete(req.params.ticketId);

    if (!ticket) {
      return next(new AppError("Ticket not found with this id", 404));
    }

    if (ticket.imgPublicId) {
      await cloudinary.v2.uploader.destroy(ticket.imgPublicId);
    }

    const response: ApiResponse<null> = {
      status: "success",
      message: "Ticket deleted successfully",
      data: null,
    };
    sendResponse(200, response, res);
  }
);

// TODO: implement this function after creating the processed ticket logic  to integrate with

// process a shop ticket by id.
export const processSupportTicket = catchAsync(
  async (req: ShopSupportTicketRequest, res: Response, next: NextFunction) => {
    // extract the required data from the request object (That added on the middleware part.)
    const { shopOwner, shop, ticket } = req;
    const { ticketResponse } = req.body;

    ticket.status = "closed";
    ticket.ticketResponse = ticketResponse;
    ticket.ticketProcessedDate = new Date();
    ticket.processedBy = {
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
    };
    const updatedTicket = await ticket.save();

    // send the email to the user.
    sendShopSupportTicketProcessedEmail(shop, shopOwner, updatedTicket);

    // create the response object
    const response: ApiResponse<IShopSupportTicket> = {
      status: "success",
      data: updatedTicket,
    };

    // send the response to the client
    sendResponse(200, response, res);
  }
);
