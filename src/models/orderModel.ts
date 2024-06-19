import { Schema, model, Types, Model } from "mongoose";
import { IOrder } from "./order.interface";
const OrderSchema: Schema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    itemsQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["payment_on_delivery", "paid"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "credit_card"],
    },
    shippingStatus: {
      type: String,
      required: true,
      enum: ["pending", "shipped"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: ["processing", "completed", "cancelled", "refunded"],
      default: "processing",
    },

    discountCodes: {
      type: [String],
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    estimatedDeliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
// data populated from
OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ shippingStatus: 1 });

OrderSchema.pre<IOrder>(/^find/, function (next) {
  this.populate({
    path: "items",
    populate: {
      path: "product",
    },
  });
  next();
});
const Order = model<IOrder>("Order", OrderSchema);

export default Order;
