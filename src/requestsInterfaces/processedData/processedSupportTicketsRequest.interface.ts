import { AuthUserRequest } from "../shared/request.interface";

export interface ProcessedSupportTicketsRequest extends AuthUserRequest {
  params: {
    id: string;
  };
}
