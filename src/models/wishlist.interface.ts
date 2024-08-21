import { Document, Types } from "mongoose";
import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IWishlistItem extends Document {
  user: IUser;
  product: IProduct;
}
