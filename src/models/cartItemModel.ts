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
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

cartItemSchema.methods.calculateTotalPrice = function () {
  this.price = this.product.price * this.quantity;
  if (this.discount > 0) {
    this.discount = this.product.discount * this.quantity;
    this.priceAfterDiscount = this.price - this.discount;
  }
};
cartItemSchema.pre<ICartItem>("save", function (next) {
  this.calculateTotalPrice();
  next();
});
cartItemSchema.pre<ICartItem>(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "name price discount price quantity",
  });
  next();
});
const CartItem: Model<ICartItem> = model<ICartItem>("CartItem", cartItemSchema);
export default CartItem;
