import { Schema, Model, model } from "mongoose";
import { IProcessedReturnProductRequest } from "./processedReturnProducts.interface";
import { OrderSchema } from "./orderModel";
import { productSchema } from "./productModel";

const processedReturnProductRequestSchema: Schema =
  new Schema<IProcessedReturnProductRequest>(
    {
      requestId: {
        type: Schema.Types.ObjectId,
        ref: "ReturnRequest",
        required: true,
      },
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
      product: productSchema,
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
      quantity: {
        type: Number,
        required: true,
      },
      returnReason: {
        type: String,
        required: true,
      },
      returnStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled"],
        required: true,
      },
      receivedItemsStatus: {
        type: String,
        enum: ["Received", "Not Received"],
        required: true,
      },
      refundAmount: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
      },
      processedDate: {
        type: Date,
      },
      requestCreatedAt: {
        type: Date,
        required: true,
      },
      requestLastUpdate: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  );

const ProcessedReturnProductRequest: Model<IProcessedReturnProductRequest> =
  model<IProcessedReturnProductRequest>(
    "ProcessedReturnProductRequest",
    processedReturnProductRequestSchema
  );

export default ProcessedReturnProductRequest;
