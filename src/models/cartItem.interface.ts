import { Document, Schema } from "mongoose";

export interface ICartItem extends Document {
  cart: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
}
