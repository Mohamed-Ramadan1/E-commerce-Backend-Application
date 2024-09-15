import { ObjectId } from "mongoose";
import { AuthUserRequest } from "../shared/request.interface";
import { IShop } from "../../models/shop/shop.interface";

export interface SubOrderRequest extends AuthUserRequest {
  params: {
    productId: string;
    orderId: string;
  };
  shopId: ObjectId;
  shop: IShop;
}
