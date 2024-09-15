import { AuthUserRequest } from "../shared/request.interface";

export interface ProcessedShopRequestsReq extends AuthUserRequest {
  body: {};
  params: {
    id: string;
  };
}
