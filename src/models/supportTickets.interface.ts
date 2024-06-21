import { Document, Types } from "mongoose";

export interface ISupportTicket extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  subject: string;
  description: string;
  status: "open" | "on-progress" | "closed";
  category: 'website issue' | 'account issue' | 'general inquiry';
}
