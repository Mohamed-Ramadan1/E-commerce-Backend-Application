import { AuthUserRequest } from "../request.interface";

export interface WebsiteDiscountCodeRequest extends AuthUserRequest {
  body: {};
  params: {
    id: string;
  };
}
