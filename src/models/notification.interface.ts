import { Document, Schema } from "mongoose";
import { IUser } from "./user.interface";

export enum NotificationType {
  Order = "order",
  Update = "update",
  Alert = "alert",
}

export interface INotification extends Document {
  user: IUser;
  message: string;
  type: NotificationType;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
