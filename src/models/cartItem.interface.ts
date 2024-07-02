import { Document, Types, Schema } from "mongoose";
export interface ICartItem extends Document {
  _id: Schema.Types.ObjectId;
  cart: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  calculateTotalPrice(): void;
}
