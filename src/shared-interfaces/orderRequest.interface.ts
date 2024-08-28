import { IOrder } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { AuthUserRequest } from "./request.interface";
import { IShop } from "../models/shop.interface";

export interface OrderRequest extends AuthUserRequest {
  order: IOrder;
  shop: IShop;
  userOrderOwner: IUser;

  params: {
    id: string;
  };
}
