import { Model, Schema, model } from "mongoose";
import { IShopSupportTicket } from "./shopSupportTicket.interface";

const shopSupportTicketSchema = new Schema(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "on-progress", "closed"],
      default: "open",
    },
    category: {
      type: String,
      enum: [
        "shop issue",
        "product issue",
        "order issue",
        "shipping issue",
        "return issue",
        "refund issue",
        "payment issue",
        "account issue",
        "financial issue",
        "general inquiry",
        "other",
      ],
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
