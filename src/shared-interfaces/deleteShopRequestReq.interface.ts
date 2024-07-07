import { IUser } from "../models/user.interface";
import { AuthUserRequest } from "./request.interface";
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import { IShop } from "../models/shop.interface";

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
