import { Document, Types } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export enum PaymentStatus {
  PaymentOnDelivery = "payment_on_delivery",
  Paid = "paid",
}

export enum PaymentMethod {
  Cash = "cash",
  CreditCard = "credit_card",
}

export enum ShippingStatus {
  Pending = "pending",
  Shipped = "shipped",
}

export enum OrderStatus {
  Processing = "processing",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  itemsQuantity: number;
  totalPrice: number;
  totalDiscount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingAddress: string;
  phoneNumber: string;
  shippingCost: number;
  orderStatus: OrderStatus;
  archived: boolean;
  customerNotes?: string;
  internalNotes?: string;
  discountCodes?: string[];
  taxAmount?: number;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
