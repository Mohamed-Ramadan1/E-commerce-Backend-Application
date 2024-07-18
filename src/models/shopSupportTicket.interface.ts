import { Document, Schema } from "mongoose";

export interface IShopSupportTicket extends Document {
  _id: Schema.Types.ObjectId;
  shop: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "on-progress" | "closed";
  category:
    | "shop issue"
    | "product issue"
    | "order issue"
    | "shipping issue"
    | "return issue"
    | "refund issue"
    | "payment issue"
    | "account issue"
    | "financial issue"
    | "general inquiry"
    | "other";

  processedBy: {
    user: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  img: string;
  imgPublicId: string;
  ticketCreatedDate: Date;
  ticketUpdatedDate: Date;
  ticketProcessedDate: Date;
  ticketResponse: string;
  createdAt: Date;
  updatedAt: Date;
}
