import { Document, Schema } from "mongoose";
import { IProduct } from "./product.interface";
import { IShoppingCart } from "./shoppingCart.interface";

export interface ICartItem extends Document {
  _id: Schema.Types.ObjectId;
  cart: Schema.Types.ObjectId;
  product: IProduct;
  quantity: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  calculateTotalPrice(): void;
}
