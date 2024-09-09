import { AuthUserRequest } from "./request.interface";
import { IUser } from "../models/user/user.interface";
import { IDeleteShopRequest } from "../models/deleteShopRequest/deleteShopRequest.interface";
import { IShop } from "../models/shop/shop.interface";

export interface DeleteShopRequestReq extends AuthUserRequest {
  body: {
    shopId: string;
    reason: string;
    userId: string;
  };
  params: {
    id: string;
  };
  shopOwner: IUser;
  deleteShopRequest: IDeleteShopRequest;
  shop: IShop;
}
