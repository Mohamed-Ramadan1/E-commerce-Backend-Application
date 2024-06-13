import { Schema, Model, model } from "mongoose";
import { ICartItem } from "./cartItem.interface";

const cartItemSchema: Schema<ICartItem> = new Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "ShoppingCart",
      required: true,
    },
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
  { timestamps: true }
);
cartItemSchema.pre("save", function (next) {
  this.populate({
    path: "product",
  });
  next();
});
const CartItem: Model<ICartItem> = model<ICartItem>("CartItem", cartItemSchema);
export default CartItem;
