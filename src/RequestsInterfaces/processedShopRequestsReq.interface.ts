import { AuthUserRequest } from "./request.interface";

export interface ProcessedShopRequestsReq extends AuthUserRequest {
  body: {};
  params: {
    id: string;
  };
}
