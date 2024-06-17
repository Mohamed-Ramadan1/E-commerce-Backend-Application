import { Schema, model } from "mongoose";
import { ICartItem } from "./cartItem.interface";
import { IShoppingCart } from "./shoppingCart.interface";
const shoppingCartSchema = new Schema<IShoppingCart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: "CartItem" }],
    total_quantity: { type: Number, required: true, default: 0 },
    total_discount: { type: Number, required: true, default: 0 },
    total_price: { type: Number, required: true, default: 0 },
    total_shipping_cost: { type: Number, required: true, default: 0 },
    payment_status: { type: String, required: true, default: "pending" },
    payment_method: {
      type: String,
      enum: ["cash", "credit_card"],
      default: "cash",
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

  // Assuming a flat shipping cost per item for simplicity
  const shippingCostPerItem = 5;
  this.total_shipping_cost = this.total_quantity * shippingCostPerItem;
};

shoppingCartSchema.pre<IShoppingCart>(/^find/, function (next) {
  this.populate({
    path: "items",
    
  });
  next();
});

const ShoppingCart = model<IShoppingCart>("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;
