import { Document, Schema } from "mongoose";

export interface ICartItem extends Document {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
}
