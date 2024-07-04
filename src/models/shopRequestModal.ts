import { Schema, model, Model } from "mongoose";
import { IShopRequest } from "./shopRequest.interface";

const shopRequestSchema: Schema = new Schema<IShopRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shopDescription: { type: String, required: true },
    requestStatus: {
      type: String,
      enum: ["approved", "pending", "rejected", "cancelled"],
      default: "pending",
    },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

shopRequestSchema.pre<IShopRequest>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phoneNumber active verified",
  });
  next();
});

const ShopRequest: Model<IShopRequest> = model<IShopRequest>(
  "ShopRequest",
  shopRequestSchema
);

export default ShopRequest;
