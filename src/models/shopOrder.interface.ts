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
  user: Schema.Types.ObjectId;
  vendorType: VendorType;
  shop: Schema.Types.ObjectId | undefined;
  masterOrder: Schema.Types.ObjectId;
  items: ICartItem[];
  itemsQuantity: number;
  subtotal: number;
  totalPrice: number;
  totalDiscount: number;
  shippingCost: number;
  phoneNumber: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingStatus: ShippingStatus;
  shippingAddress: string;
  orderStatus: OrderStatus;
  discountCodes?: string[];
  taxAmount: number;
  platformFee: number;
  shopRevenue: number;
  archived: boolean;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  customerNotes?: string;
  shopNotes?: string;
  refundAmount: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
