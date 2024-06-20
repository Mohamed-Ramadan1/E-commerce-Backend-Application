import { Document, Types } from "mongoose";
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  shoppingCart: Types.ObjectId;
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
  emailToken: string;
  isModified: (path: string) => boolean;
  comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
