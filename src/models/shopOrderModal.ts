import { Schema, model, Types } from "mongoose";
// imports interface of the shop-order and enums
import {
  IShopOrder,
  PaymentStatus,
  PaymentMethod,
  ShippingStatus,
  OrderStatus,
} from "./shopOrder.interface";

const itemsSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  priceAfterDiscount: {
    type: Number,
    required: true,
  },
});

export const ShopOrderSchema: Schema = new Schema<IShopOrder>(
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
    masterOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    items: [itemsSchema],
    itemsQuantity: {
      type: Number,
      required: true,
    },
    subtotal: {
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
    phoneNumber: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PAYMENT_ON_DELIVERY,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethod),
    },
    shippingStatus: {
      type: String,
      required: true,
      enum: Object.values(ShippingStatus),
      default: ShippingStatus.PENDING,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PROCESSING,
    },
    discountCodes: {
      type: [String],
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      default: 0,
    },
    shopRevenue: {
      type: Number,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    customerNotes: {
      type: String,
    },
    shopNotes: {
      type: String,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for improved query performance
ShopOrderSchema.index({ user: 1, shop: 1 });
ShopOrderSchema.index({ masterOrder: 1 });
ShopOrderSchema.index({ orderStatus: 1 });
ShopOrderSchema.index({ paymentStatus: 1 });
ShopOrderSchema.index({ shippingStatus: 1 });

// Pre-find hook to populate items.product
ShopOrderSchema.pre<IShopOrder>(/^find/, function (next) {
  this.populate({
    path: "items.product",
    select: "name price", // Add any other fields you want to populate
  });
  next();
});

const ShopOrder = model<IShopOrder>("ShopOrder", ShopOrderSchema);

export default ShopOrder;
