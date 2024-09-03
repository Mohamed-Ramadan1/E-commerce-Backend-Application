import { AuthUserRequest } from "./request.interface";
import { ICartItem } from "../models/cartItem.interface";
import { Schema } from "mongoose";
import { IOrder } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { IReturnRequest } from "../models/returnProducts.interface";

export interface ReturnItemsRequest extends AuthUserRequest {
  returnedProduct: ICartItem;
  order: IOrder;
  userToReturn: IUser;
  returnRequest: IReturnRequest;
  body: {
    orderId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    quantity: number;
    returnReason: string;
    comments?: string;
    rejectionReason:string
  };
  params: {
    id?: string;
  };
}
