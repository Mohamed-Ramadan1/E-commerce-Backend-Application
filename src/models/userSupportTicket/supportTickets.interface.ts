import { Document, Schema } from "mongoose";

export enum TicketStatus {
  Open = "open",
  OnProgress = "on-progress",
  Closed = "closed",
}

export enum TicketCategory {
  WebsiteIssue = "website issue",
  AccountIssue = "account issue",
  GeneralInquiry = "general inquiry",
}

export interface ISupportTicket extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  status: TicketStatus;
  category: TicketCategory;
  processedBy: {
    user: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  ticketProcessedDate: Date;
  ticketResponse: string;
  createdAt: Date;
  updatedAt: Date;
}
