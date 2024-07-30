import { Document, Types } from "mongoose";

export interface IWishlistItem extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
}
