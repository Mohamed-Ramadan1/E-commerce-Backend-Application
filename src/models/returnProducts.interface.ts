import { Document, Schema } from "mongoose";
import { IProduct } from "./product.interface";

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

export interface IReturnRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  processedBy: Schema.Types.ObjectId;
  product: IProduct;
  quantity: number;
  returnReason: string;
  returnStatus: ReturnStatus;
  receivedItemsStatus: ReceivedItemsStatus;
  refundAmount: number;
  comments?: string;
  processedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
