import { Model, Schema, model } from "mongoose";
import {
  ISupportTicket,
  TicketCategory,
  TicketStatus,
} from "../supportTickets/supportTickets.interface";

const supportTicketsSchema: Schema = new Schema<ISupportTicket>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      enum: Object.values(TicketStatus), // Use enum values
      default: TicketStatus.Open, // Use enum default value
    },
    category: {
      type: String,
      enum: Object.values(TicketCategory), // Use enum values
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
    ticketProcessedDate: Date,
    ticketResponse: String,
  },
  {
    timestamps: true,
  }
);

const SupportTicket: Model<ISupportTicket> = model<ISupportTicket>(
  "SupportTicket",
  supportTicketsSchema
);

export default SupportTicket;
