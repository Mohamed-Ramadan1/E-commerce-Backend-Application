import { Document, ObjectId } from "mongoose";
import { IUser } from "../user/user.interface";
import { IShop } from "../shop/shop.interface";

export enum RecipientType {
  SHOP = "shop",
  USER = "user",
}

export enum MessagePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export interface IMessage extends Document {
  _id: ObjectId;
  sender: IUser;
  recipient: IUser | IShop;
  recipientType: RecipientType;
  subject: string;
  content: string;
  metaData?: {
    category?: string;
    priority?: MessagePriority;
    tags?: string[];
    actionRequired?: Boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
