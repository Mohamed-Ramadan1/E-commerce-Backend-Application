import { Types, Document } from "mongoose";
import { IUser } from "../user/user.interface";

export enum PrimeSubscriptionStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export enum PrimeSubscriptionPlan {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}
export enum PrimeSubscriptionPaymentMethod {
  STRIPE = "stripe",
  PAYED_BY_ADMIN = "payed_by_admin",
}

export interface IPrimeSubScription extends Document {
  _id: Types.ObjectId;
  user: IUser;
  status: PrimeSubscriptionStatus;
  plan: PrimeSubscriptionPlan;
  startDate: Date;
  endDate: Date;
  originalSubscriptionAmount: number;
  discountedSubscriptionAmount: number;
  subscriptionAmount: number;
  autoRenew: boolean;
  paymentMethod: PrimeSubscriptionPaymentMethod;
  lastBillingDate: Date;
  nextBillingDate: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
