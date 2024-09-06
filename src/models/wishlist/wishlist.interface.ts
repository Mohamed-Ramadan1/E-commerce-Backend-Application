import { Document, Types } from "mongoose";
import { IProduct } from "../product/product.interface";
import { IUser } from "../user/user.interface";
export interface IWishlistItem extends Document {
  user: IUser;
  product: IProduct;
}
