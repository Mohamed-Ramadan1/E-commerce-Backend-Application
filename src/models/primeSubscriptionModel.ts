import { Schema, Model, model } from "mongoose";

import {
  IPrimeSubScription,
  PrimeSubscriptionPlan,
  PrimeSubscriptionPaymentMethod,
  PrimeSubscriptionStatus,
} from "./primeSubscription.interface";
import mongoose from "mongoose";
import sendExpirationReminderEmail from "../emails/primeSubscriptions/sendExpirationReminderEmail";
import sendExpiredMembershipEmail from "../emails/primeSubscriptions/sendExpiredMembershipEmail";

const primeSubscriptionSchema = new Schema<IPrimeSubScription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PrimeSubscriptionStatus),
      default: PrimeSubscriptionStatus.ACTIVE,
    },
    plan: {
      type: String,
      enum: Object.values(PrimeSubscriptionPlan),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    originalSubscriptionAmount: {
      type: Number,
      required: true,
    },
    discountedSubscriptionAmount: {
      type: Number,
      required: true,
    },
    subscriptionAmount: {
      type: Number,
      required: true,
    },
    autoRenew: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PrimeSubscriptionPaymentMethod),
      required: true,
    },

    lastBillingDate: {
      type: Date,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

primeSubscriptionSchema.index({ user: 1, status: 1 });

// Populate user
primeSubscriptionSchema.pre<IPrimeSubScription>(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phoneNumber",
  });
  next();
});

// Ensure endDate is always greater than startDate
primeSubscriptionSchema.pre("validate", function (next) {
  if (this.endDate <= this.startDate) {
    this.invalidate("endDate", "End date must be after the start date.");
  }
  next();
});

// Static method to update expired status
primeSubscriptionSchema.statics.updateExpiredStatus = async function (docId) {
  await this.findByIdAndUpdate(docId, {
    status: PrimeSubscriptionStatus.EXPIRED,
  });
};

// Post save middleware to handle expiration reminders and status updates
primeSubscriptionSchema.post<IPrimeSubScription>("save", async function (doc) {
  try {
    if (doc && doc.endDate) {
      const now = new Date();
      const fiveDaysFromNow = new Date(now.setDate(now.getDate() + 5));

      if (
        doc.endDate <= fiveDaysFromNow &&
        doc.status !== PrimeSubscriptionStatus.EXPIRED
      ) {
        sendExpirationReminderEmail(doc.user, doc);
      }

      if (doc.endDate < now && doc.status !== PrimeSubscriptionStatus.EXPIRED) {
        await (this.constructor as any).updateExpiredStatus(doc._id);
        sendExpiredMembershipEmail(doc.user, doc);
      }
    }
  } catch (error) {
    console.error("Error in post-save middleware:", error);
  }
});

const PrimeSubscription: Model<IPrimeSubScription> = model<IPrimeSubScription>(
  "PrimeSubscription",
  primeSubscriptionSchema
);
export default PrimeSubscription;
