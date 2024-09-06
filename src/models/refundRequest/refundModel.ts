import { Schema, Model, model } from "mongoose";
import {
  IRefundRequest,
  RefundMethod,
  RefundStatus,
  RefundType,
} from "./refund.interface";
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
    },
    rejectReason: {
      type: String,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    refundMethod: {
      type: String,
      enum: Object.values(RefundMethod),
      required: true,
    },
    refundType: {
      type: String,
      enum: Object.values(RefundType),
      required: true,
    },
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.Pending,
    },
    refundProcessedAt: {
      type: Date,
    },
    isRelatedToShop: {
      type: Boolean,
      default: false,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

// pre find to populate user and order
refundRequestSchema.pre<IRefundRequest>(/^find/, function (next) {
  this.populate("shop");
  next();
});
const RefundRequest: Model<IRefundRequest> = model<IRefundRequest>(
  "RefundRequest",
  refundRequestSchema
);

export default RefundRequest;
