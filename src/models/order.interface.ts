import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  itemsQuantity: number;
  totalPrice: number;
  totalDiscount: number;
  paymentStatus: "payment_on_delivery" | "paid";
  paymentMethod: "cash" | "credit_card";
  shippingStatus: "pending" | "shipped";
  shippingAddress: string;
  shippingCost: number;
  orderStatus: "processing" | "completed" | "cancelled" | "refunded";
  customerNotes?: string;
  internalNotes?: string;
  discountCodes?: string[];
  taxAmount?: number;
  estimatedDeliveryDate?: Date;
}
