import { Model, Schema, model } from "mongoose";
import { ISupportTicket } from "./supportTickets.interface";

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
      enum: ["open", "on-progress", "closed"],
      default: "open",
    },
    category: {
      type: String,
      enum: ["website issue", "account issue", "general inquiry"],
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
