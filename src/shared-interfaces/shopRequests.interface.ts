import { AuthUserRequest } from "./request.interface";
import { IShop } from "../models/shop.interface";
import { IUser } from "../models/user.interface";
import { IShopRequest } from "../models/shopRequest.interface";

export interface ShopRequestReq extends AuthUserRequest {
  userToOpenShop: IUser;
  shopRequest: IShopRequest;
  body: {
    shopDescription: string;
    rejectionReason: string;
  };
  params: {
    id: string;
  };
}

export interface ShopSettingsRequest extends AuthUserRequest {
  shop: IShop;

  body: {
    email: string;
    reason: string;
    shopName?: string;
    shopDescription?: string;
    shopPhoneNumber?: string;
    photo?: string;
    banner?: string;
    categories?: string[];
    owner?: string;
  };

  params: {
    token: string;
  };
}

export interface VerifyShopEmailUpdating extends Request {
  shop: IShop;
  user: IUser;
  params: {
    token: string;
  };
}
