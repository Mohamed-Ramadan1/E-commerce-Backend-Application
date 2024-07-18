import { Document, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { IProduct } from "./product.interface";

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
  returnStatus: "Pending" | "Approved" | "Rejected" | "Cancelled";
  receivedItemsStatus: "Received" | "Not Received";
  refundAmount: number;
  comments?: string;
  processedDate?: Date;
  requestCreatedAt: Date;
  requestLastUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}
