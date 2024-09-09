import { AuthUserRequest } from "./request.interface";
import { IOrder } from "../models/order/order.interface";
import { IUser } from "../models/user/user.interface";
import { IRefundRequest } from "../models/refundRequest/refund.interface";

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
