import { Schema, Model, model } from "mongoose";
import { IDeleteShopRequest } from "./deleteShopRequest.interface";

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
      enum: ["pending", "rejected", "cancelled", "approved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

deleteShopRequestSchema.pre<IDeleteShopRequest>(/^find/, function (next) {
  this.populate({ path: "user", select: "name email" });
  this.populate({
    path: "shop",
    select: "shopName email owner",
  });
  next();
});

const DeleteShopRequest: Model<IDeleteShopRequest> = model<IDeleteShopRequest>(
  "DeleteShopRequest",
  deleteShopRequestSchema
);

export default DeleteShopRequest;
