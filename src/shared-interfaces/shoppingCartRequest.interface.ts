import { AuthUserRequest } from "./request.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { ICartItem } from "../models/cartItem.interface";
import { IProduct } from "../models/product.interface";
import { ObjectId } from "mongoose";

export interface ShoppingCartRequest extends AuthUserRequest {
  userShopCart: IShoppingCart;
  product: IProduct;
  userShoppingCartItem: ICartItem | null;
  body: {
    productId: ObjectId;
    quantity: number;
    discount?: number;
  };

  params: {
    id: string;
    productId: string;
  };
}
