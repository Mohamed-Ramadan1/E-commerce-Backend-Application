import { Document, Schema } from "mongoose";

export interface IRefundRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  processedBy: Schema.Types.ObjectId;
  refundAmount: number;
  refundMethod: "stripe" | "giftCard";
  refundType: "return" | "cancellation";
  refundStatus: "pending" | "processing" | "confirmed" | "rejected";
  refundProcessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
