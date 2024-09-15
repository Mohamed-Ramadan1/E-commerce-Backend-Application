import { Schema, model } from "mongoose";
// imports interface of the shop-order and enums
import { cartItemSchema } from "../cartItem/cartItemModel";
import {
  ISubOrder,
  PaymentStatus,
  PaymentMethod,
  ShippingStatus,
  OrderStatus,
  VendorType,
} from "../order/subOrder.interface";

const SubOrderSchema = new Schema(
  {
    mainOrder: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    vendorType: {
      type: String,
      enum: Object.values(VendorType),
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    items: [cartItemSchema],
    itemsQuantity: {
      type: Number,
      required: true,
    },
    subtotalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
    },
    netPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    shippingStatus: {
      type: String,
      enum: Object.values(ShippingStatus),
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    discountCodes: [
      {
        type: String,
      },
    ],
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Indexes for improved query performance
SubOrderSchema.index({ user: 1, shop: 1 });
SubOrderSchema.index({ masterOrder: 1 });
SubOrderSchema.index({ orderStatus: 1 });
SubOrderSchema.index({ paymentStatus: 1 });
SubOrderSchema.index({ shippingStatus: 1 });

// Pre-find hook to populate items.product
SubOrderSchema.pre<ISubOrder>(/^find/, function (next) {
  this.populate({
    path: "items.product",
    select: "name price",
  });

  this.populate({
    path: "shop",
  });
  next();
});

const SubOrder = model<ISubOrder>("SubOrders", SubOrderSchema);

export default SubOrder;
