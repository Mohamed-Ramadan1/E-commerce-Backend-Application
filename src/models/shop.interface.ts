import { Document, Schema } from "mongoose";

export interface IShop extends Document {
  _id: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  email: string;
  phone: string;
  shopName: string;
  shopDescription: string;
  categories?: string[];
  photo?: string;
  photoPublicId?: string;
  banner?: string;
  products?: Schema.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
