import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";
import { AuthUserRequest } from "../shared/request.interface";

export interface PrimeSubscriptionRequest extends AuthUserRequest {
  latestSubscription: IPrimeSubScription;
  body: {
    paymentIntentId: string;
    cancellationReason: string;
  };
  params: {
    id: string;
  };
}
