import { IUser } from "../../models/user/user.interface";
import { IOrder } from "../../models/order/order.interface";

export function applyGiftCard(user: IUser, order: IOrder): void {
  if (user.giftCard > 0) {
    const distractedAmount = Math.min(user.giftCard, order.totalPrice);
    order.totalPrice -= distractedAmount;
    user.giftCard -= distractedAmount;
    order.paidAmountWithUserGiftCard = distractedAmount;
  }
}
