import { Schema, Model, model } from "mongoose";

import {
  IProcessedSupportTickets,
  TicketCategory,
  TicketStatus,
} from "./processedSupportTickets.Interface";
const processedSupportTicketSchema: Schema =
  new Schema<IProcessedSupportTickets>(
    {
      user: {
        userId: Schema.Types.ObjectId,
        name: String,
        email: String,
        phoneNumber: String,
        role: String,
      },
      subject: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(TicketStatus),
        default: TicketStatus.Open,
      },
      category: {
        type: String,
        enum: Object.values(TicketCategory),
        required: true,
      },
      processedBy: {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        name: String,
        email: String,
        phoneNumber: String,
        role: String,
      },

      ticketCreatedDate: {
        type: Date,
        default: Date.now,
      },
      ticketLastUpdatedDate: {
        type: Date,
        default: Date.now,
      },
      ticketProcessedDate: Date,
    },
    {
      timestamps: true,
    }
  );
const ProcessedSupportTicket: Model<IProcessedSupportTickets> =
  model<IProcessedSupportTickets>(
    "ProcessedSupportTicket",
    processedSupportTicketSchema
  );

export default ProcessedSupportTicket;
