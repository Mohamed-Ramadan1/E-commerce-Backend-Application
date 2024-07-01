import { Document, Schema, Types } from "mongoose";
export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  shoppingCart: Schema.Types.ObjectId;
  giftCard: number;
  photo?: string;
  photoPublicId?: string;
  password: string;
  passwordConfirmation: string | undefined;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: string;
  purchaseHistory: Types.ObjectId[];
  address?: string;
  shippingAddress?: string;
  active: boolean;
  verified: boolean;
  emailVerificationToken: string | undefined;
  isModified: (path: string) => boolean;
  createEmailVerificationToken: () => string;
  createPasswordResetToken: () => string;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
