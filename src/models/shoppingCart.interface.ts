import { Types, Document, Schema } from "mongoose";

export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
}

// Enum for payment method
export enum PaymentMethod {
  Cash = "cash",
  CreditCard = "credit_card",
}

export interface IShoppingCart extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  items: Schema.Types.ObjectId[];
  total_quantity: number;
  total_discount: number;
  total_price: number;
  total_shipping_cost: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  calculateTotals: () => void;
}
