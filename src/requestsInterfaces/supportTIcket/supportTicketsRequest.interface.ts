import { AuthUserRequest } from "../shared/request.interface";

export interface SupportTicketRequest extends AuthUserRequest {
  body: {
    subject: string;
    description: string;
    category: string;
    userId: string;
    ticketResponse: string;
  };
  params: {
    id: string;
  };
}
