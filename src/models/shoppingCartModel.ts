import { Schema, Model, model } from "mongoose";
import { IShoppingCart } from "./shoppingCart.interface";
const ShoppingCartSchema: Schema<IShoppingCart> = new Schema(
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

// Pre-save hook to calculate totals

ShoppingCartSchema.methods.calculateTotals = function () {};
// ShoppingCartSchema.pre("save", function (next) {
//   this.calculateTotals();
//   next();
// });

const ShoppingCart: Model<IShoppingCart> = model<IShoppingCart>(
  "ShoppingCart",
  ShoppingCartSchema
);

export default ShoppingCart;
