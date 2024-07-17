import { Document, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";

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
  refundMethod: "stripe" | "giftCard";
  refundType: "return" | "cancellation";
  refundStatus: "pending" | "processing" | "confirmed" | "rejected";
  refundProcessedAt: Date;
  refundCreatedAt: Date;
  refundLastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}
