import { Document, Types } from "mongoose";
import { IProduct } from "./product.interface";

export interface IWishlistItem extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
}
