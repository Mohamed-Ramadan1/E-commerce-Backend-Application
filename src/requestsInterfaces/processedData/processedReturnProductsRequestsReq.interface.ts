import { AuthUserRequest } from "../shared/request.interface";

export interface ProcessedReturnProductRequestReq extends AuthUserRequest {
  params: {
    id: string;
  };
}
