import { Schema, model } from "mongoose";
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

// pre find hook populate the products
shoppingCartSchema.methods.calculateTotals = function () {
  console.log(this);
};

// pre save hook calculate the total price
shoppingCartSchema.pre<IShoppingCart>("save", function (next) {
  this.calculateTotals();
  console.log("traggerdown");
  next();
});

// pre save hook calculate the total price
shoppingCartSchema.pre<IShoppingCart>(/^find/, function (next) {
  this.populate("items");
  next();
});

const ShoppingCart = model<IShoppingCart>("ShoppingCart", shoppingCartSchema);

export default ShoppingCart;
