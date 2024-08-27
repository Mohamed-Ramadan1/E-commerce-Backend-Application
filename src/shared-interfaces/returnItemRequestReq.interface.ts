import { AuthUserRequest } from "./request.interface";
import { ICartItem } from "../models/cartItem.interface";
import { Schema } from "mongoose";

export interface ReturnItemsRequest extends AuthUserRequest {
  returnedProduct: ICartItem;
  body: {
    orderId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    quantity: number;
    returnReason: string;
    comments?: string;
  };
  params: {
    id?: string;
  };
}
