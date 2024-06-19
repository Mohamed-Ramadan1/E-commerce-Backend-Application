import { Types, Document, Schema } from "mongoose";
export interface IShoppingCart extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  items: Schema.Types.ObjectId[];
  total_quantity: number;
  total_discount: number;
  total_price: number;
  total_shipping_cost: number;
  payment_status: "pending" | "paid";
  payment_method: "cash" | "credit_card";
  calculateTotals: () => void;
}
