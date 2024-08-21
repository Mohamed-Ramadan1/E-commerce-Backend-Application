import { AuthUserRequest } from "./request.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";

export interface CheckoutRequest extends AuthUserRequest {
  shoppingCart: IShoppingCart;
  shipAddress: string;
  phoneNumber: string;

  body: {
    shippingAddress?: string;
    phoneNumber?: string;
  };
}
