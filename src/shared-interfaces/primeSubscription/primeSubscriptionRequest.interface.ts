import { IPrimeSubScription } from "../../models/primeMemberShip/primeSubscription.interface";
import { AuthUserRequest } from "../request.interface";

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
