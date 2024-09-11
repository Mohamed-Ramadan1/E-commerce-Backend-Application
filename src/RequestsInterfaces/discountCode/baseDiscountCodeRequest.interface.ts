import { AuthUserRequest } from "../request.interface";
import { DiscountType } from "../../models/discountCode/discountCode.interface";
import {
  ProductCategory,
  IProduct,
} from "../../models/product/product.interface";
export interface BaseDiscountCodeRequest extends AuthUserRequest {
  body: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;

    minimumPurchaseAmount?: number;
    allowedProducts?: IProduct[];
    allowedCategories?: ProductCategory[];
  };

  params: {
    id: string;
  };
}
