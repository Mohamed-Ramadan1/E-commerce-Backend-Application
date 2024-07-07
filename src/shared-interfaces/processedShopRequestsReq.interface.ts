import { IUser } from "../models/user.interface";
import { AuthUserRequest } from "./request.interface";
import { IDeleteShopRequest } from "../models/deleteShopRequest.interface";
import { IShop } from "../models/shop.interface";

export interface ProcessedShopRequestsReq extends AuthUserRequest {
  body: {};
  params: {
    id: string;
  };
}
