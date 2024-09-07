import { IUser } from "../../models/user/user.interface";
import { AuthUserRequest } from "../request.interface";
import { IPrimeSubScription } from "../../models/primeSubscription/primeSubscription.interface";
export interface AdminPrimeSubscriptionRequest extends AuthUserRequest {
  userToSubscribe: IUser;
  prevPrimeSubscription?: IPrimeSubScription;
  body: {
    userId: string;
    cancellationReason?: string;
  };
  params: {
    id: string;
  };
}
