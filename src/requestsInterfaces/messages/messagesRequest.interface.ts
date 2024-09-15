import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import { AuthUserRequest } from "../shared/request.interface";
import {
  RecipientType,
  MessagePriority,
} from "../../models/messages/message.interface";
import { ObjectId } from "mongoose";

export interface MessageRequest extends AuthUserRequest {
  recipient: IShop | IUser;
  sender: IUser;
  body: {
    recipient: ObjectId;
    recipientType: RecipientType;
    subject: string;
    content: string;
    metaData?: {
      category?: string;
      priority?: MessagePriority;
      tags?: string[];
      actionRequired?: Boolean;
    };
  };
  params: {
    id: string;
  };
}
