import { AuthUserRequest } from "../shared/request.interface";

export interface ProcessedRefundRequestReq extends AuthUserRequest {
  params: {
    id: string;
  };
}
