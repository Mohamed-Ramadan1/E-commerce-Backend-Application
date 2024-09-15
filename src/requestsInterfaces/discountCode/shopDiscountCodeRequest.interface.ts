import { IShop } from "../../models/shop/shop.interface";
import { BaseDiscountCodeRequest } from "./baseDiscountCodeRequest.interface";

export interface ShopDiscountCodeRequest extends BaseDiscountCodeRequest {
  shop: IShop;
}
