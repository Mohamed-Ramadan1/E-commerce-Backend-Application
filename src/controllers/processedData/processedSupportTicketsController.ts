// system imports
import { NextFunction, Response } from "express";

import ProcessedSupportTicket from "../../models//processedData/processedSupportTicketsModal";

// interface imports
import { IProcessedSupportTickets } from "../../models//processedData/processedSupportTickets.Interface";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import { ProcessedSupportTicketsRequest } from "../../requestsInterfaces/processedData/processedSupportTicketsRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

// get all processed support tickets.
export const getProcessedSupportTickets = catchAsync(
  async (
    req: ProcessedSupportTicketsRequest,
    res: Response,
    next: NextFunction
  ) => {
    const features = new APIFeatures(ProcessedSupportTicket.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const processedSupportTickets: IProcessedSupportTickets[] =
      await features.execute();

    const response: ApiResponse<IProcessedSupportTickets[]> = {
      status: "success",
      results: processedSupportTickets.length,
      data: processedSupportTickets,
    };

    sendResponse(200, response, res);
  }
);

// get single processed support ticket by id.
export const getProcessedSupportTicket = catchAsync(
  async (
    req: ProcessedSupportTicketsRequest,
    res: Response,
    next: NextFunction
  ) => {
    const processedSupportTicket: IProcessedSupportTickets | null =
      await ProcessedSupportTicket.findById(req.params.id);

    if (!processedSupportTicket) {
      return next(new AppError("No support ticket found with that ID", 404));
    }

    const response: ApiResponse<IProcessedSupportTickets> = {
      status: "success",
      data: processedSupportTicket,
    };

    sendResponse(200, response, res);
  }
);

// update processed support ticket.
export const updateProcessedSupportTicket = catchAsync(
  async (
    req: ProcessedSupportTicketsRequest,
    res: Response,
    next: NextFunction
  ) => {
    const processedSupportTicket: IProcessedSupportTickets | null =
      await ProcessedSupportTicket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!processedSupportTicket) {
      return next(new AppError("No support ticket found with this ID", 404));
    }

    const response: ApiResponse<IProcessedSupportTickets> = {
      status: "success",
      data: processedSupportTicket,
    };

    sendResponse(200, response, res);
  }
);

// delete process tickets
export const deleteProcessedSupportTicket = catchAsync(
  async (
    req: ProcessedSupportTicketsRequest,
    res: Response,
    next: NextFunction
  ) => {
    const processedSupportTicket: IProcessedSupportTickets | null =
      await ProcessedSupportTicket.findByIdAndDelete(req.params.id);

    if (!processedSupportTicket) {
      return next(new AppError("No support ticket found with this ID", 404));
    }

    const response: ApiResponse<IProcessedSupportTickets> = {
      status: "success",
      message: "Support ticket deleted successfully",
    };

    sendResponse(204, response, res);
  }
);
