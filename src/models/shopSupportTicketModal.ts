import { Model, Schema, model } from "mongoose";
import {
  IShopSupportTicket,
  SupportTicketCategory,
  SupportTicketStatus,
} from "./shopSupportTicket.interface";

const shopSupportTicketSchema = new Schema<IShopSupportTicket>(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(SupportTicketStatus), // Use enum values
      default: SupportTicketStatus.Open,
    },
    category: {
      type: String,
      enum: Object.values(SupportTicketCategory), // Use enum values
      required: true,
    },
    img: { type: String },
    imgPublicId: { type: String },
    processedBy: {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      role: { type: String },
    },
    ticketCreatedDate: { type: Date },
    ticketUpdatedDate: { type: Date },
    ticketProcessedDate: { type: Date },
    ticketResponse: { type: String },
  },
  { timestamps: true }
);

const ShopSupportTicket: Model<IShopSupportTicket> = model<IShopSupportTicket>(
  "ShopSupportTicket",
  shopSupportTicketSchema
);

export default ShopSupportTicket;
