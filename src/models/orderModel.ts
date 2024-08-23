import { Schema, model } from "mongoose";
import {
  IOrder,
  PaymentMethod,
  PaymentStatus,
  ShippingStatus,
  OrderStatus,
} from "./order.interface";
import { ICartItem } from "./cartItem.interface";

export const ItemSchema = new Schema<ICartItem>({
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

export const OrderSchema: Schema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentSessionId: {
      type: String,
    },

    items: [ItemSchema],
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
    phoneNumber: {
      type: String,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: Object.values(PaymentStatus),
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
      default: ShippingStatus.Pending,
    },
    shippingAddress: {
      type: String,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Processing,
    },

    discountCodes: {
      type: [String],
    },
    taxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    archived: {
      type: Boolean,
      default: false,
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
