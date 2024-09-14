import { Document, Schema } from "mongoose";

export interface IShop extends Document {
  _id: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  email: string;
  phone: string;
  shopName: string;
  balance: number;
  shopDescription: string;
  categories?: string[];
  photo?: string;
  photoPublicId?: string;
  banner?: string;
  bannerId?: string;
  products?: Schema.Types.ObjectId[];
  isActive: boolean;
  tempChangedEmail: string | undefined;
  changeEmailVerificationToken: string | undefined;
  changeEmailVerificationTokenExpiresAt: Date | undefined;
  createChangeEmailVerificationToken: () => string;
  createdAt: Date;
  updatedAt: Date;
}
