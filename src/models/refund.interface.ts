import { Document, Schema } from "mongoose";

export enum RefundMethod {
  Stripe = "stripe",
  GiftCard = "giftCard",
}

export enum RefundType {
  Return = "return",
  Cancellation = "cancellation",
}

export enum RefundStatus {
  Pending = "pending",
  Processing = "processing",
  Confirmed = "confirmed",
  Rejected = "rejected",
}

export interface IRefundRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  processedBy: Schema.Types.ObjectId;
  refundAmount: number;
  refundMethod: RefundMethod;
  refundType: RefundType;
  refundStatus: RefundStatus;
  refundProcessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
