import { Schema, model } from "mongoose";
import { ICartItem } from "../cartItem/cartItem.interface";
import {
  IShoppingCart,
  PaymentMethod,
  PaymentStatus,
} from "./shoppingCart.interface";

const shoppingCartSchema: Schema = new Schema<IShoppingCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem", default: [] }],
    total_quantity: { type: Number, required: true, default: 0 },
    total_discount: { type: Number, required: true, default: 0 },
    total_price: { type: Number, required: true, default: 0 },
    total_shipping_cost: { type: Number, required: true, default: 0 },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.Pending,
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.Cash,
    },
  },
  { timestamps: true }
);
shoppingCartSchema.methods.calculateTotals = function () {
  this.total_quantity = this.items.reduce(
    (total: number, item: ICartItem) => total + item.quantity,
    0
  );

  this.total_discount = this.items.reduce(
    (total: number, item: ICartItem) => total + item.discount,
    0
  );

  this.total_price = this.items.reduce(
    (total: number, item: ICartItem) => total + item.priceAfterDiscount,
    0
  );

  // shipping cost are constant for now
  this.total_shipping_cost = 30;
};

shoppingCartSchema.pre<IShoppingCart>(/^find/, function (next) {
  this.populate({
    path: "items",
  });
  next();
});

// Adding indexes to improve query performance
shoppingCartSchema.index({ user: 1 });
shoppingCartSchema.index({ payment_status: 1 });
shoppingCartSchema.index({ payment_method: 1 });

const ShoppingCart = model<IShoppingCart>("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;
