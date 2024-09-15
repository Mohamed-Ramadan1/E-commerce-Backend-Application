import { AuthUserRequest } from "../shared/request.interface";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { Schema } from "mongoose";
import { IOrder } from "../../models/order/order.interface";
import { IUser } from "../../models/user/user.interface";
import { IReturnRequest } from "../../models/product/returnProducts.interface";

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
    rejectionReason: string;
  };
  params: {
    id?: string;
  };
}
