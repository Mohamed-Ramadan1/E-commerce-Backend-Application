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
