import { ObjectId } from "mongoose";
import { ICartItem } from "../../models/cartItem.interface";

type OrderObject = {
  user: ObjectId;
  items: ICartItem[];
  itemsQuantity: Number;
  totalDiscount: Number;
  shippingAddress: string;
  phoneNumber: string;
  totalPrice: Number;
  shippingCost: Number;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  orderStatus: string;
};

export const createOrderObject = (
  user: ObjectId,
  items: ICartItem[],
  itemsQuantity: Number,
  totalDiscount: Number,
  shippingAddress: string,
  phoneNumber: string,
  totalPrice: Number,
  shippingCost: Number,
  paymentStatus: string,
  paymentMethod: string,
  shippingStatus: string,
  orderStatus: string
) => {
  const orderData: OrderObject = {
    user,
    items,
    itemsQuantity,
    totalDiscount,
    shippingAddress,
    phoneNumber,
    totalPrice,
    shippingCost,
    paymentStatus,
    paymentMethod,
    shippingStatus,
    orderStatus,
  };
  return orderData;
};
