import { Document, Schema } from "mongoose";
import { ICartItem } from "./cartItem.interface";

// Enums
export enum PaymentStatus {
  PAYMENT_ON_DELIVERY = "payment_on_delivery",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
}

export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit_card",
  PLATFORM_WALLET = "platform_wallet",
}

export enum ShippingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export enum OrderStatus {
  PROCESSING = "processing",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum VendorType {
  WEBSITE = "website",
  SHOP = "shop",
}

// Interface with enums
export interface IShopOrder extends Document {
  _id: Schema.Types.ObjectId;
  mainOrder: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  vendorType: VendorType;
  shop?: Schema.Types.ObjectId;
  items: ICartItem[];
  itemsQuantity: number;
  subtotalPrice: number;
  totalDiscount: number;
  platformFee: number;
  netPrice: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingAddress: string;
  orderStatus: OrderStatus;
  discountCodes?: string[];
  archived: boolean;

  createdAt: Date;
  updatedAt: Date;
}
