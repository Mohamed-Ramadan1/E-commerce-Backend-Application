import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";
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
  status: "open" | "on-progress" | "closed";
  category: "website issue" | "account issue" | "general inquiry";
  ticketCreatedDate: Date;
  ticketLastUpdatedDate: Date;
  ticketProcessedDate: Date;
  ticketResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

// may need to add who process this ticket .
