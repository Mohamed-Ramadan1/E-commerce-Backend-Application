import { Document, ObjectId } from "mongoose";
import { IShop } from "../shop/shop.interface";
import { IUser } from "../user/user.interface";

export enum ReportStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  RESOLVED = "resolved",
}

export interface IReportShop extends Document {
  _id: ObjectId;
  reportedShop: IShop;
  reportedBy: IUser;
  resolvedBy?: IUser;
  resolvedAt?: Date;
  resolved: boolean;
  resolvedByComments?: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
}
