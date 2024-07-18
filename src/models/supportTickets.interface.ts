import { Document, Schema } from "mongoose";

export interface ISupportTicket extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "on-progress" | "closed";
  category: "website issue" | "account issue" | "general inquiry";
  processedBy: {
    user: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  ticketProcessedDate: Date;
  ticketResponse:string;
  createdAt: Date;
  updatedAt: Date;
}
