import { IShop } from "../models/shop.interface";
import { IProduct } from "../models/product.interface";
import { AuthUserRequest } from "./request.interface";

export interface ShopProductsRequest extends AuthUserRequest {
  body: {
    name: string;
    description: string;
    category: string;
    brand: string;
    color?: string;
    stock_quantity: number;
    price: number;
    discount?: number;
    material: string;
    availability_status?: string;
    manufacturer?: string;
    images?: string[];
    /////////////////////
    sourceType?: string;
    shopId?: string;
    return_policy?: string;
    totalReviews?: number;
    averageRating?: number;
  };
  params: {
    shopId: string;
    productId: string;
  };
  productInformation: Object;
  shop: IShop;
  product: IProduct;
}
