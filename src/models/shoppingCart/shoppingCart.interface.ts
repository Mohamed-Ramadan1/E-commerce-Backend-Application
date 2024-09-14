import { Document, Schema } from "mongoose";
import { ICartItem } from "../cartItem/cartItem.interface";
import { IUser } from "../user/user.interface";
import { IDiscountCode } from "../discountCode/discountCode.interface";
export enum PaymentStatus {
  Pending = "pending",
  Paid = "paid",
}

// Enum for payment method
export enum PaymentMethod {
  Cash = "cash",
  CreditCard = "credit_card",
}

export interface IShoppingCart extends Document {
  _id: Schema.Types.ObjectId;
  user: IUser;
  items: ICartItem[];
  total_quantity: number;
  total_discount: number;
  total_price: number;
  total_shipping_cost: number;
  discount_code?: IDiscountCode;
  discount_code_applied?: boolean;
  discount_code_amount?: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  calculateTotals: () => void;
}
