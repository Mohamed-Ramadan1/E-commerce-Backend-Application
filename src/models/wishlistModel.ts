import { Schema, Model, model } from "mongoose";
import { IWishlistItem } from "./wishlist.interface";
const wishlistSChema: Schema<IWishlistItem> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);
const Wishlist: Model<IWishlistItem> = model<IWishlistItem>(
  "Wishlist",
  wishlistSChema
);

export default Wishlist;
