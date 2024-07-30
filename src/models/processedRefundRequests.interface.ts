import { Document, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";

// Define enums
export enum RefundMethod {
  Stripe = "stripe",
  GiftCard = "giftCard",
}

export enum RefundType {
  Return = "return",
  Cancellation = "cancellation",
}

export enum RefundStatus {
  Pending = "pending",
  Processing = "processing",
  Confirmed = "confirmed",
  Rejected = "rejected",
}

// Update the interface to use the enums
export interface IProcessedRefundRequests extends Document {
  _id: Schema.Types.ObjectId;
  user: {
    _id: Schema.Types.ObjectId;
    email: string;
    name: string;
    phoneNumber: string;
  };
  order: IOrder;
  returnedProduct?: IProduct[];
  processedBy: {
    _id: Schema.Types.ObjectId;
    email: string;
    name: string;
    phoneNumber: string;
    role: string;
  };
  refundAmount: number;
  refundMethod: RefundMethod;
  refundType: RefundType;
  refundStatus: RefundStatus;
  refundProcessedAt: Date;
  refundCreatedAt: Date;
  refundLastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}
