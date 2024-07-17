import { Schema, Model, model } from "mongoose";
import { IProcessedRefundRequests } from "./processedRefundRequests.interface";
import { OrderSchema } from "./orderModel";
import { productSchema } from "./productModel";

const processedRefundRequestSchema: Schema =
  new Schema<IProcessedRefundRequests>(
    {
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
      },
      order: OrderSchema,
      returnedProduct: [productSchema],
      processedBy: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
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
        enum: ["pending", "processing", "confirmed", "rejected"],
        required: true,
      },
      refundProcessedAt: {
        type: Date,
        required: true,
      },
      refundCreatedAt: {
        type: Date,
        required: true,
      },
      refundLastUpdate: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

const ProcessedRefundRequests: Model<IProcessedRefundRequests> =
  model<IProcessedRefundRequests>(
    "ProcessedRefundRequests",
    processedRefundRequestSchema
  );

export default ProcessedRefundRequests;
