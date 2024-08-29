import { Schema, Model, model } from "mongoose";
import {
  IReturnRequest,
  ReturnStatus,
  ReceivedItemsStatus,
} from "./returnProducts.interface";
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
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      enum: Object.values(ReturnStatus),
      default: ReturnStatus.Pending,
    },
    receivedItemsStatus: {
      type: String,
      enum: Object.values(ReceivedItemsStatus),
      default: ReceivedItemsStatus.NotReceived,
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
