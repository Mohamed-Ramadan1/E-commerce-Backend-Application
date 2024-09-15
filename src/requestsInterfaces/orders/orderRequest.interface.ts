import { AuthUserRequest } from "../shared/request.interface";
import { IOrder } from "../../models/order/order.interface";
import { IUser } from "../../models/user/user.interface";
import { IShop } from "../../models/shop/shop.interface";

export interface OrderRequest extends AuthUserRequest {
  order: IOrder;
  shop: IShop;
  userOrderOwner: IUser;

  params: {
    id: string;
  };
}
