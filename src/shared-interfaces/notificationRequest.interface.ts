import { AuthUserRequest } from "./request.interface";

export interface NotificationRequest extends AuthUserRequest {
  params: {
    id: string;
  };
  body: {
    message: string;
    type: string;
    userId:string
  };
}
