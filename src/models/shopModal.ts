import { Schema, model, Model } from "mongoose";
import { IShop } from "./shop.interface";
import validator from "validator";

const shopSchema: Schema = new Schema<IShop>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number",
      ],
    },
    shopName: {
      type: String,
      required: true,
    },
    shopDescription: {
      type: String,
    },
    categories: [String],
    photo: {
      type: String,
    },
    photoPublicId: {
      type: String,
    },
    banner: {
      type: String,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Shop: Model<IShop> = model<IShop>("Shop", shopSchema);

export default Shop;
