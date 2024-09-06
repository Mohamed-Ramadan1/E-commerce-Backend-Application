import { Document, Schema } from "mongoose";
import { IOrder } from "../order/order.interface";
import { IProduct } from "../product/product.interface";
// Define enums
export enum ReturnStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Cancelled = "Cancelled",
}

export enum ReceivedItemsStatus {
  Received = "Received",
  NotReceived = "Not Received",
}

export interface IProcessedReturnProductRequest extends Document {
  _id: Schema.Types.ObjectId;
  requestId: Schema.Types.ObjectId;
  user: {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
  };
  order: IOrder;
  product: IProduct;
  processedBy: {
    _id: Schema.Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
  quantity: number;
  returnReason: string;
  returnStatus: ReturnStatus;
  receivedItemsStatus: ReceivedItemsStatus;
  refundAmount: number;
  comments?: string;
  processedDate?: Date;
  requestCreatedAt: Date;
  requestLastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}
