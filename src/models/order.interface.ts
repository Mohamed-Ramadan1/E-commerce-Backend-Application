import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  totalPrice: number;
  totalDiscount: number;
  totalShippingCost: number;
  paymentStatus: "pending" | "paid";
  paymentMethod: "cash" | "credit_card";
  shippingStatus: "pending" | "shipped";
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  createdAt: Date;
  updatedAt: Date;
  orderStatus: "processing" | "completed" | "cancelled" | "refunded";
  customerNotes?: string;
  internalNotes?: string;
  discountCodes?: string[];
  taxAmount: number;
  currency: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date;
}
