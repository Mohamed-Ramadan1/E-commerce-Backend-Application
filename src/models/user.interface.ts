import { Document, Schema, Types } from "mongoose";
import { IShoppingCart } from "./shoppingCart.interface";
import { IShop } from "./shop.interface";

export interface IUser extends Document {
  googleId?: String;
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  shoppingCart: IShoppingCart;
  giftCard: number;
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
