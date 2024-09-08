import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";
import { AuthUserRequest } from "../request.interface";

export interface PrimeSubscriptionRequest extends AuthUserRequest {
  latestSubscription: IPrimeSubScription;
  body: {
    
    cancellationReason: string;
  };
  params: {
    id: string;
  };
}
