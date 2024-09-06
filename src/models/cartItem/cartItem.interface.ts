import { Document, Schema } from "mongoose";
import { IProduct } from "../product/product.interface";
import { IShoppingCart } from "../shoppingCart/shoppingCart.interface";

export interface ICartItem extends Document {
  _id: Schema.Types.ObjectId;
  cart: IShoppingCart;
  product: IProduct;
  quantity: number;
  price: number;
  discount: number;
  priceAfterDiscount: number;
  calculateTotalPrice(): void;
  createdAt: Date;
  updatedAt: Date;
}
