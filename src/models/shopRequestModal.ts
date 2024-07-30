import { Schema, model, Model } from "mongoose";
import { IShopRequest, RequestStatus } from "./shopRequest.interface";

const shopRequestSchema: Schema = new Schema<IShopRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shopDescription: { type: String, required: true },
    requestStatus: {
      type: String,
      enum: Object.values(RequestStatus), // Use enum values
      default: RequestStatus.Pending, // Default value
    },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: { type: Date },
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
