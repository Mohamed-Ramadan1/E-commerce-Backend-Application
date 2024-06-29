import { Schema, Model, model } from "mongoose";
import { IRefundRequest } from "./refund.interface";
const refundRequestSchema: Schema = new Schema<IRefundRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    refundMethod: {
      type: String,
      enum: ["stripe", "giftCard"],
      required: true,
    },
    refundType: {
      type: String,
      enum: ["return", "cancellation"],
      required: true,
    },
    refundStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
    },
    refundProcessedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const RefundRequest: Model<IRefundRequest> = model<IRefundRequest>(
  "RefundRequest",
  refundRequestSchema
);

export default RefundRequest;
