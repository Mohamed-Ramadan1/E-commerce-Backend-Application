import { AuthUserRequest } from "requestsInterfaces/shared/request.interface";

export interface AnalyticsRequest extends AuthUserRequest {
  params: {
    id: string;
    shopId: string;
  };
}
