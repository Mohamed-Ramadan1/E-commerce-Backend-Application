import { Schema, Model, model } from "mongoose";
import { IUser } from "./user.interface";
import { userSchema } from "./userModel";
import { IProcessedSupportTickets } from "./processedSupportTickets.Interface";
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
        enum: ["open", "on-progress", "closed"],
      },
      category: {
        type: String,
        enum: ["website issue", "account issue", "general inquiry"],
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
