import { AuthUserRequest } from "../request.interface";

export interface ShopDiscountCodeRequest extends AuthUserRequest {
 
  body: {

  };
  params: {
    id: string;
  };
}
