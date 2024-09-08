import { PrimeSubscriptionPlan } from "../models/primeMemberShip/primeSubscription.interface";

export const SUBSCRIPTION_PLANS = {
  [PrimeSubscriptionPlan.MONTHLY]: {
    originalAmount: 50,
    discountedAmount: 0,
  },
  [PrimeSubscriptionPlan.YEARLY]: {
    originalAmount: 500,
    discountedAmount: 0,
  },
};
