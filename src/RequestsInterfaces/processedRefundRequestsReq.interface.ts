import { AuthUserRequest } from "./request.interface";

export interface ProcessedRefundRequestReq extends AuthUserRequest {
  params: {
    id: string;
  };
}
