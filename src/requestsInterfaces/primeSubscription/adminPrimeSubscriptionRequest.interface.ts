import { IUser } from "../../models/user/user.interface";
import { AuthUserRequest } from "../shared/request.interface";
import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";
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
