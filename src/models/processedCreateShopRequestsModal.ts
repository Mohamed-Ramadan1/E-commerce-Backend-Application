import { Schema, Model, model } from "mongoose";
import { IProcessedShopRequest } from "./processedCreateShopRequests.interface";

const processedCreateShopRequestsSchema: Schema =
  new Schema<IProcessedShopRequest>(
    {
      user: {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: false,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },

      shopDescription: {
        type: String,
        required: true,
      },
      requestStatus: {
        type: String,
        required: true,
      },
      processedBy: {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: false,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },
      processedDate: {
        type: Date,
      },
      requestCreatedDate: {
        type: Date,
      },
      requestLastUpdatedDate: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

const ProcessedCreateShopRequests: Model<IProcessedShopRequest> =
  model<IProcessedShopRequest>(
    "ProcessedCreateShopRequests",
    processedCreateShopRequestsSchema
  );

export default ProcessedCreateShopRequests;
