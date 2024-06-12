import { Schema, Model, model } from "mongoose";
import { IShoppingCart } from "./shoppingCart.interface";
import { ICartItem } from "./cartItem.interface";
import cartItemSchema from "./cartItem.schema"; // Import the CartItem schema

const shoppingCartSchema: Schema<IShoppingCart> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shopping cart must be assigned to a user"],
    },
    products: [cartItemSchema], // Use the CartItem schema here
    total_quantity: {
      type: Number,
      default: 0,
    },
    total_discount: {
      type: Number,
      default: 0,
    },
    total_price: {
      type: Number,
      default: 0,
    },
    total_shipping_cost: {
      type: Number,
      default: 0,
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["cash", "credit_card"],
      default: "cash",
    },
  },
  { timestamps: true }
);

// Method to calculate totals
shoppingCartSchema.methods.calculateTotals = function () {
  this.total_quantity = this.products.reduce(
    (acc: number, item: ICartItem) => acc + item.quantity,
    0
  );
  this.total_discount = this.products.reduce(
    (acc: number, item: ICartItem) => acc + item.discount,
    0
  );
  this.total_price = this.products.reduce(
    (acc: number, item: ICartItem) => acc + item.price * item.quantity,
    0
  );
  this.total_shipping_cost = this.total_quantity * 5; // Example shipping cost calculation
  this.total_price -= this.total_discount; // Apply discount to total price
};

// Pre-save hook to calculate totals
shoppingCartSchema.pre("save", function (next) {
  this.calculateTotals();
  next();
});

const shoppingCartModel: Model<IShoppingCart> = model<IShoppingCart>(
  "ShoppingCart",
  shoppingCartSchema
);

export default shoppingCartModel;
