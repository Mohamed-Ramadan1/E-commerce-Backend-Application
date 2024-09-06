import { Schema, Model, model } from "mongoose";
import {
  IDeleteShopRequest,
  RequestStatus,
} from "./deleteShopRequest.interface";

const deleteShopRequestSchema: Schema = new Schema<IDeleteShopRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: {
      type: Date,
    },
    reason: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.Pending,
    },
  },
  {
    timestamps: true,
  }
);

deleteShopRequestSchema.pre<IDeleteShopRequest>(/^find/, function (next) {
  this.populate({ path: "user" });
  this.populate({
    path: "shop",
  });
  next();
});

const DeleteShopRequest: Model<IDeleteShopRequest> = model<IDeleteShopRequest>(
  "DeleteShopRequest",
  deleteShopRequestSchema
);

export default DeleteShopRequest;
