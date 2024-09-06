import { ObjectId, Document } from "mongoose";
import { ProductCategory } from "../product/product.interface";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXEDAMOUNT = "fixed_amount",
}

export enum DiscountCodeSource {
  SHOP = "shop",
  WEBSITE = "website",
}

export interface IDiscountCode extends Document {
  _id: ObjectId;
  code: string;
  discountType: DiscountType;
  discountCodeSource: DiscountCodeSource;
  discountValue: number;
  shopId?: ObjectId;
  startDate: Date;
  endDate: Date;
  minimumPurchaseAmount?: number;
  usageLimit?: number;
  usageCount: number;
  allowedProducts?: ObjectId[];
  allowedCategories?: ProductCategory[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
