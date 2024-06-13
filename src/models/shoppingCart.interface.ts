import { Types, Document } from "mongoose";

export interface IShoppingCart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: Types.ObjectId[];
  total_quantity: number;
  total_discount: number;
  total_price: number;
  total_shipping_cost: number;
  payment_status: "pending" | "paid";
  payment_method: "cash" | "credit_card";
  calculateTotals: () => void;
}
