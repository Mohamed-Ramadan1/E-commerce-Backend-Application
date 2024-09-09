import { AuthUserRequest } from "./request.interface";

export interface ProcessedReturnProductRequestReq extends AuthUserRequest {
  params: {
    id: string;
  };
}
