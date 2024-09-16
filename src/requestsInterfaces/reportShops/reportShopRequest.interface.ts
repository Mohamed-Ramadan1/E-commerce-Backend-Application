import { ObjectId } from "mongoose";
import { AuthUserRequest } from "../shared/request.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import { IReportShop } from "../../models/reportShops/reportShop.interface";

export interface ReportShopRequest extends AuthUserRequest {
  shop: IShop;
  userToReport: IUser;
  report: IReportShop;
  body: {
    reportedShop: ObjectId;
    resolvedByComments?: string;
    reportedBy: ObjectId;
    reason: string;
    description: string;
  };
  params: {
    id: string;
  };
}
