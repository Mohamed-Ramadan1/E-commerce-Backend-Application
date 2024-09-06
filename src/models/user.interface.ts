import { Document, ObjectId, Schema, Types } from "mongoose";
import { IShoppingCart } from "./shoppingCart.interface";
import { IShop } from "./shop.interface";
import { PrimeSubscriptionStatus } from "./primeSubscription.interface";

// Enums
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  TRADER = "trader",
}

export enum DefaultPhotoUrl {
  PHOTO_URL = "https://res.cloudinary.com/deqgzvkxp/image/upload/v1718812055/defaultProileImg_j1ilwv.png",
}

export interface IUser extends Document {
  googleId?: String;
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  isPrimeUser: boolean;
  primeSubscriptionStatus?: PrimeSubscriptionStatus;
  lastPrimeSubscriptionDocument: Types.ObjectId;
  phoneNumber: string;
  shoppingCart: IShoppingCart;
  giftCard: number;
  isNotificationMuted: boolean;
  photo?: string;
  photoPublicId?: string;
  password: string;
  passwordConfirmation: string | undefined;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: string;
  purchaseHistory: Types.ObjectId[];
  address: string;
  shippingAddress?: string;
  active: boolean;
  verified: boolean;
  myShop: IShop | undefined;
  emailVerificationToken: string | undefined;
  isModified: (path: string) => boolean;
  createEmailVerificationToken: () => string;
  createPasswordResetToken: () => string;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
