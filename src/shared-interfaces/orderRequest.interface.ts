import { AuthUserRequest } from "./request.interface";

export interface OrderRequest extends AuthUserRequest {
  params: {
    id: string;
  };
}
