import { Schema, Model, model } from "mongoose";
import { IProcessedDeletedShopRequest } from "./processedDeleteShopRequest.interface";

const processedDeleteShopRequestSchema: Schema =
  new Schema<IProcessedDeletedShopRequest>(
    {
      user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
      shop: {
        shopName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      },
      processedBy: {
        name: { type: String, required: true },
        email: { type: String, required: true },
      },
      reason: { type: String, required: true },
      processedAt: { type: Date, default: Date.now, required: true },
      requestStatus: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

const ProcessedDeleteShopRequest: Model<IProcessedDeletedShopRequest> =
  model<IProcessedDeletedShopRequest>(
    "ProcessedDeleteShopRequest",
    processedDeleteShopRequestSchema
  );

export default ProcessedDeleteShopRequest;
