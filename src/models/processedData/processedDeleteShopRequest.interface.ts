import { Document, Schema } from "mongoose";

export interface IProcessedDeletedShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  shop: {
    shopName: string;
    email: string;
    phone: string;
  };
  processedBy: {
    name: string;
    email: string;
  };
  reason: string;
  processedAt: Date;
  requestStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
