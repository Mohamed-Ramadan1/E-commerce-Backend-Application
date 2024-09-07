import { ClientSession } from "mongoose";
import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";
import { IRefundRequest } from "../../models/refundRequest/refund.interface";
import refundRequestCreatedEmail from "../../emails/users/refundRequestConfirmationEmail";
import AppError from "../apiUtils/ApplicationError";
import RefundRequest from "../../models/refundRequest/refundModel";

export const createRefundRequest = async (
  user: IUser,
  session: ClientSession,
  order: IOrder
) => {
  try {
    const refundRequest = new RefundRequest({
      user: user._id,
      order: order._id,
      refundAmount: order.totalPrice.toFixed(2),
      refundMethod: "giftCard",
      refundType: "cancellation",
    });
    const savedRefundRequest: IRefundRequest | null = await refundRequest.save({
      session,
    });
    if (!savedRefundRequest) {
      throw new AppError("Error saving refund request", 500);
    }
    refundRequestCreatedEmail(user, savedRefundRequest);

    return savedRefundRequest;
  } catch (err) {
    throw new AppError("Error creating refund request", 500);
  }
};
