import { Document, Schema } from "mongoose";
import { ICartItem } from "../cartItem/cartItem.interface";
import { IDiscountCode } from "../discountCode/discountCode.interface";
export enum PaymentStatus {
  PaymentOnDelivery = "payment_on_delivery",
  Paid = "paid",
}

export enum PaymentMethod {
  Cash = "cash",
  CreditCard = "credit_card",
}

export enum ShippingStatus {
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
}

export enum OrderStatus {
  PENDING = "pending",
  Processing = "processing",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export interface IOrder extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  paymentSessionId?: string;
  items: ICartItem[];

  itemsQuantity: number;

  paidAmountWithUserGiftCard: number;
  totalDiscount: number;
  shippingCost: number;
  totalPrice: number;
  discountCodeAmount?: number;
  isDiscountCodeApplied?: boolean;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingAddress: string;
  phoneNumber: string;
  orderStatus: OrderStatus;
  archived: boolean;
  customerNotes?: string;
  internalNotes?: string;
  discountCodes: IDiscountCode[];
  taxAmount: number;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
