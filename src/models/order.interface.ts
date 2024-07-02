import { Document, Types } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  itemsQuantity: number;
  totalPrice: number;
  totalDiscount: number;
  paymentStatus: "payment_on_delivery" | "paid";
  paymentMethod: "cash" | "credit_card";
  shippingStatus: "pending" | "shipped";
  shippingAddress: string;
  phoneNumber: string;
  shippingCost: number;
  orderStatus: "processing" | "delivered" | "cancelled";
  archived: boolean;
  customerNotes?: string;
  internalNotes?: string;
  discountCodes?: string[];
  taxAmount?: number;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
