import { ObjectId } from "mongoose";
import { AuthUserRequest } from "./request.interface";
import { IShop } from "../models/shop.interface";

export interface ShopOrderRequest extends AuthUserRequest {
  params: {
    productId: string;
    orderId: string;
  };
  shopId: ObjectId;
  shop: IShop;
}
