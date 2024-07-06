import { Document, Schema, Types } from "mongoose";

export interface IDeleteShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shop: Schema.Types.ObjectId;
  processedBy: Schema.Types.ObjectId;
  processedAt: Date;
  reason: string;
  requestStatus: "pending" | "rejected" | "cancelled" | "approved";
  createdAt: Date;
  updatedAt: Date;
}
