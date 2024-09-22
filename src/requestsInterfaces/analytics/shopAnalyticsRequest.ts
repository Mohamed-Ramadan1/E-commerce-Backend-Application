import { AuthUserRequest } from "requestsInterfaces/shared/request.interface";

export interface ShopAnalyticsRequest extends AuthUserRequest {
  body: {
    year: number;
    month: string;
  };
  params: {
    shopId: string;
    id: string;
  };
}
