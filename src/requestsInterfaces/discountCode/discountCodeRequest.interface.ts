import { AuthUserRequest } from "../shared/request.interface";
import { IDiscountCode } from "../../models/discountCode/discountCode.interface";

import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
export interface DiscountCodeRequest extends AuthUserRequest {
  discountCode: IDiscountCode;
  userShoppingCart: IShoppingCart;
  body: {
    code: string;
  };

  params: {
    id: string;
  };
}
