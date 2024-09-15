import { Document, Schema } from "mongoose";

export enum SupportTicketStatus {
  Open = "open",
  OnProgress = "on-progress",
  Closed = "closed",
}

export enum SupportTicketCategory {
  ShopIssue = "shop issue",
  ProductIssue = "product issue",
  OrderIssue = "order issue",
  ShippingIssue = "shipping issue",
  ReturnIssue = "return issue",
  RefundIssue = "refund issue",
  PaymentIssue = "payment issue",
  AccountIssue = "account issue",
  FinancialIssue = "financial issue",
  GeneralInquiry = "general inquiry",
  Other = "other",
}

export interface IShopSupportTicket extends Document {
  _id: Schema.Types.ObjectId;
  shop: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  status: SupportTicketStatus; // Use enum
  category: SupportTicketCategory; // Use enum
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
