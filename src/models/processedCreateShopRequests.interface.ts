import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface IProcessedShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: {
    name: string;
    email: string;
    phoneNumber: string;
    _id: Schema.Types.ObjectId;
    role: string;
  };
  shopDescription: string;
  requestStatus: string;
  processedBy: {
    name: string;
    email: string;
    phoneNumber: string;
    _id: Schema.Types.ObjectId;
    role: string;
  };

  processedDate: Date;
  requestCreatedDate: Date;
  requestLastUpdatedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
