import { AuthUserRequest } from "requestsInterfaces/shared/request.interface";

export interface WebsiteAnalyticsRequest extends AuthUserRequest {
  body: {
    year: number;
    month: string;
  };
  params: {
    id: string;
  };
}
