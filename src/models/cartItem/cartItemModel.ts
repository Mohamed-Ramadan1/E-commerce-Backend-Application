import { Schema, Model, model } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export const cartItemSchema: Schema<ICartItem> = new Schema(
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
    discountCodes: {
      type: [Schema.Types.ObjectId],
      ref: "DiscountCode",
      default: [],
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

cartItemSchema.methods.calculateTotalPrice = async function () {
  const product = await this.model("Product").findById(this.product);

  this.price = product.price * this.quantity;
  this.discount = product.discount * this.quantity;
  this.priceAfterDiscount = this.price - this.discount;
};

// Pre-save middleware to calculate total price before saving
cartItemSchema.pre<ICartItem>("save", async function (next) {
  await this.calculateTotalPrice();
  next();
});

cartItemSchema.pre<ICartItem>(/^find/, function (next) {
  this.populate({
    path: "product",
  });
  next();
});

const CartItem: Model<ICartItem> = model<ICartItem>("CartItem", cartItemSchema);
export default CartItem;
