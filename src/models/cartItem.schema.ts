import { Schema } from "mongoose";
import { ICartItem } from "./cartItem.interface";

const cartItemSchema: Schema<ICartItem> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1."],
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

export default cartItemSchema;
