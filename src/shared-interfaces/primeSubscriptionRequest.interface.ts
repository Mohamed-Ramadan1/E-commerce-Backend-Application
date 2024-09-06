import { AuthUserRequest } from "./request.interface";

export interface PrimeSubscriptionRequest extends AuthUserRequest {
  body: {
    userId: string;
  };
  params: {
    id: string;
  };
}
