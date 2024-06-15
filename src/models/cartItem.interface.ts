import { Document, Types } from "mongoose";

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  cart: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  calculateTotalPrice(): void;
}
