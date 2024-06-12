import { Document, Schema } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export interface IShoppingCart extends Document {
  user: Schema.Types.ObjectId;
  products: ICartItem[];
  total_quantity: number;
  total_discount: number;
  total_price: number;
  total_shipping_cost: number;
  payment_status: "pending" | "paid";
  payment_method: "cash" | "credit_card";
  calculateTotals: () => void;
}
