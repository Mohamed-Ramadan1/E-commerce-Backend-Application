import { Document, Schema } from "mongoose";

export enum RequestStatus {
  Approved = "approved",
  Pending = "pending",
  Rejected = "rejected",
  Cancelled = "cancelled",
}

export interface IShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shopDescription: string;
  requestStatus: RequestStatus;
  processedBy: Schema.Types.ObjectId;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
