import { Schema, Model, model } from "mongoose";
import { IReturnRequest } from "./returnProducts.interface";
import { productSchema } from "./productModel";
const returnProductSChema: Schema = new Schema<IReturnRequest>(
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
    product: productSchema,

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
      default: "Pending",
    },
    receivedItemsStatus: {
      type: String,
      enum: ["Received", "Not Received"],
      default: "Not Received",
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    comments: {
      type: String,
    },
    approvalDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);
returnProductSChema.index({ user: 1, order: 1 });
returnProductSChema.index({ product: 1 });
returnProductSChema.index({ returnStatus: 1 });

returnProductSChema.pre<IReturnRequest>(/^find/, function () {
  this.populate({
    path: "user",
    select: "name email",
  });
  this.populate({
    path: "order",
    select: "orderStatus",
  });
  this.populate({
    path: "product",
    select: "name price discount stock_quantity images",
  });
});

const ReturnProduct: Model<IReturnRequest> = model<IReturnRequest>(
  "ReturnProductsRequests",
  returnProductSChema
);

export default ReturnProduct;
