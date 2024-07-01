import { Document, Schema } from "mongoose";
import { IProduct } from "./product.interface";
export interface IReturnRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  product: IProduct;
  quantity: number;
  returnReason: string;
  returnStatus: "Pending" | "Approved" | "Rejected" | "Cancelled";
  receivedItemsStatus: "Received" | "Not Received";
  refundAmount: number;
  comments?: string;
  approvalDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
