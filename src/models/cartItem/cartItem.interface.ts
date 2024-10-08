import { Document, Schema } from "mongoose";
import { IProduct } from "../product/product.interface";
import { IShoppingCart } from "../shoppingCart/shoppingCart.interface";
import { IDiscountCode } from "../discountCode/discountCode.interface";

export interface ICartItem extends Document {
  _id: Schema.Types.ObjectId;
  cart: IShoppingCart;
  product: IProduct;
  quantity: number;
  price: number;
  discount: number;
  discountCodes: IDiscountCode[];
  priceAfterDiscount: number;
  calculateTotalPrice(): void;
  createdAt: Date;
  updatedAt: Date;
}
