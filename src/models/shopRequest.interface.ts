import { Document, Schema } from "mongoose";

export interface IShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  shopDescription: string;
  requestStatus: "approved" | "pending" | "rejected" | "cancelled";
  processedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
