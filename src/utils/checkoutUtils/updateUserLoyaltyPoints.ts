import { ClientSession } from "mongoose";
import { IOrder } from "../../models/order/order.interface";
import { IUser } from "../../models/user/user.interface";
import { LoyaltyPointsCategory } from "../../config/loyaltyPoints.config";
import AppError from "../apiUtils/ApplicationError";

export const updateUserLoyaltyPoints = async (
  user: IUser,
  order: IOrder,
  session: ClientSession
) => {
  try {
    const pointsCategories = user.isPrimeUser
      ? LoyaltyPointsCategory.PRIME_USER
      : LoyaltyPointsCategory.NORMAL_USER;

    const points = calculatePoints(order.totalPrice, pointsCategories);

    user.loyaltyPoints += points;
    await user.save({ validateBeforeSave: false, session });
  } catch (error) {
    console.error("Error updating user loyalty points:", error);
    throw new AppError("Failed to update user loyalty points", 500);
  }
};

function calculatePoints(
  totalPrice: number,
  categories:
    | typeof LoyaltyPointsCategory.PRIME_USER
    | typeof LoyaltyPointsCategory.NORMAL_USER
): number {
  if (totalPrice < 250) return categories.UNDER_250;
  if (totalPrice < 500) return categories.FROM_250_TO_499;
  if (totalPrice < 750) return categories.FROM_500_TO_749;
  if (totalPrice < 1000) return categories.FROM_750_TO_999;
  if (totalPrice < 2000) return categories.FROM_1000_TO_1999;
  return categories.FROM_2000_AND_ABOVE;
}
