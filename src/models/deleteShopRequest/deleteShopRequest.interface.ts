import { Document, Schema } from "mongoose";
import { IUser } from "../user/user.interface";
import { IShop } from "../shop/shop.interface";
export enum RequestStatus {
  Pending = "pending",
  Rejected = "rejected",
  Cancelled = "cancelled",
  Approved = "approved",
}

export interface IDeleteShopRequest extends Document {
  _id: Schema.Types.ObjectId;
  user: IUser;
  shop: IShop;
  processedBy: IUser;
  processedAt: Date;
  reason: string;
  requestStatus: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
