import { AuthUserRequest } from "../shared/request.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { IProduct } from "../../models/product/product.interface";
import { ObjectId } from "mongoose";

export interface ShoppingCartRequest extends AuthUserRequest {
  userShopCart: IShoppingCart;
  product: IProduct;
  userShoppingCartItem: ICartItem;
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
