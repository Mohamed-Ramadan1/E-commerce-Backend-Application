import { AuthUserRequest } from "./request.interface";
import { IOrder } from "../models/order.interface";
import { IUser } from "../models/user.interface";
import { IRefundRequest } from "../models/refund.interface";

export interface RefundRequestReq extends AuthUserRequest {
  order: IOrder;
  userToRefund: IUser;
  refundRequest: IRefundRequest;

  body: {
    order: string;
    user: string;
    refundAmount: number;
    refundMethod: "stripe" | "giftCard";
    refundType: "return" | "cancellation";
    rejectReason: string;
  };
  params: {
    id: string;
  };
}
