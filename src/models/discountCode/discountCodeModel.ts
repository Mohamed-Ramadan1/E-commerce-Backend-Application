import { Schema, Model, model } from "mongoose";
import {
  IDiscountCode,
  DiscountType,
  DiscountCodeSource,
} from "./discountCode.interface";
import { ProductCategory } from "../product/product.interface";

const discountCodeSchema: Schema = new Schema<IDiscountCode>(
  {
    code: { type: String, required: true },
    discountType: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
    },
    discountCodeSource: {
      type: String,
      enum: Object.values(DiscountCodeSource),
      required: true,
    },
    discountValue: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    minimumPurchaseAmount: { type: Number },
    usageLimit: { type: Number },
    usageCount: { type: Number, required: true, default: 0 },
    allowedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    allowedCategories: [{ type: String, enum: Object.values(ProductCategory) }],
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

discountCodeSchema.index({ code: 1 });

// Add a virtual for checking if the code is expired
discountCodeSchema.virtual<IDiscountCode>("isExpired").get(function () {
  return this.endDate < new Date();
});

// Add a method to check if the code is valid for a given purchase
discountCodeSchema.methods.isValidForPurchase = function (
  purchaseAmount: number
) {
  return (
    this.isActive &&
    !this.isExpired &&
    (!this.minimumPurchaseAmount ||
      purchaseAmount >= this.minimumPurchaseAmount) &&
    (!this.usageLimit || this.usageCount < this.usageLimit)
  );
};

const DiscountCode: Model<IDiscountCode> = model<IDiscountCode>(
  "DiscountCode",
  discountCodeSchema
);

export default DiscountCode;
