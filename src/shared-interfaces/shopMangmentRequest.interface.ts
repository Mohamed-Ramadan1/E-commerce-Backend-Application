import { AuthUserRequest } from "./request.interface";

export interface ShopsManagementRequest extends AuthUserRequest {
  params: {
    productId: string;
    shopId: string;
    orderId: string;
  };
}
