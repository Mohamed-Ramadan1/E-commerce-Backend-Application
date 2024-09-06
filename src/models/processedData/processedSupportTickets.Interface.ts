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

export interface IProcessedSupportTickets extends Document {
  _id: Schema.Types.ObjectId;
  user: {
    userId: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  subject: string;
  description: string;
  processedBy: {
    user: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  status: TicketStatus;
  category: TicketCategory;
  ticketCreatedDate: Date;
  ticketLastUpdatedDate: Date;
  ticketProcessedDate: Date;
  ticketResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

// may need to add who process this ticket .
