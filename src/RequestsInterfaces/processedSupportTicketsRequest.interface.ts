import { AuthUserRequest } from "./request.interface";

export interface ProcessedSupportTicketsRequest extends AuthUserRequest {
  params: {
    id: string;
  };
}
