import { IOrder } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { AuthUserRequest } from "./request.interface";

export interface OrderRequest extends AuthUserRequest {
  order: IOrder;
  userOrderOwner: IUser;
  params: {
    id: string;
  };
}
