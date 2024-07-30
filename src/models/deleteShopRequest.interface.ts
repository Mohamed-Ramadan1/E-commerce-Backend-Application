import { Document, Schema } from "mongoose";

export enum RequestStatus {
  Pending = "pending",
  Rejected = "rejected",
  Cancelled = "cancelled",
  Approved = "approved",
}

export interface IDeleteShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shop: Schema.Types.ObjectId;
  processedBy: Schema.Types.ObjectId;
  processedAt: Date;
  reason: string;
  requestStatus: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
