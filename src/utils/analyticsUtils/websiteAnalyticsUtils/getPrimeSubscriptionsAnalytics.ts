import PrimeSubscription from "../../../models/primeMemberShip/primeSubscriptionModel";
import { PrimeSubscriptionStatus } from "../../../models/primeMemberShip/primeSubscription.interface";

interface PrimeSubscriptionAnalytics {
  totalPrimeSubscriptions: number;
  newPrimeSubscriptions: number;
  totalActivePrimeSubscriptions: number;
  totalInactivePrimeSubscriptions: number;
}

export async function getPrimeSubscriptionAnalytics(): Promise<PrimeSubscriptionAnalytics> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  const totalPrimeSubscriptions = await PrimeSubscription.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const newPrimeSubscriptions = await PrimeSubscription.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
    status: PrimeSubscriptionStatus.ACTIVE,
  });

  const totalActivePrimeSubscriptions = await PrimeSubscription.countDocuments({
    status: PrimeSubscriptionStatus.ACTIVE,
    startDate: { $lte: endDate },
    $or: [{ endDate: { $gte: startDate } }, { endDate: null }],
  });

  const totalInactivePrimeSubscriptions =
    await PrimeSubscription.countDocuments({
      status: {
        $in: [
          PrimeSubscriptionStatus.CANCELLED,
          PrimeSubscriptionStatus.EXPIRED,
        ],
      },
      updatedAt: { $gte: startDate, $lte: endDate },
    });

  return {
    totalPrimeSubscriptions,
    newPrimeSubscriptions,
    totalActivePrimeSubscriptions,
    totalInactivePrimeSubscriptions,
  };
}
