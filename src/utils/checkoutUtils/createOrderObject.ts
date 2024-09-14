import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { IDiscountCode } from "../../models/discountCode/discountCode.interface";
import { IUser } from "../../models/user/user.interface";

export type OrderObject = {
  user: IUser;
  items: ICartItem[];
  itemsQuantity: number;
  totalDiscount: number;
  shippingAddress: string;
  phoneNumber: string;
  totalPrice: number;
  shippingCost: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  orderStatus: string;
  paymentSessionId?: string;
  discountCodes?: IDiscountCode[];
  discountCodeAmount?: number;
  isApplyDiscountCode?: boolean;
};

export const createOrderObject = (
  user: IUser,
  shoppingCart: IShoppingCart,
  shippingAddress: string,
  phoneNumber: string,
  paymentStatus: string,
  paymentMethod: string,
  shippingStatus: string,
  orderStatus: string
) => {
  const {
    items,
    total_quantity,
    total_discount,
    total_price,
    total_shipping_cost,
  } = shoppingCart;

  const totalPrice = user.isPrimeUser
    ? total_price
    : total_price + total_shipping_cost;

  const orderData: OrderObject = {
    user,
    items,
    itemsQuantity: total_quantity,
    totalDiscount: total_discount,
    shippingAddress,
    phoneNumber,
    totalPrice,
    shippingCost: total_shipping_cost,
    paymentStatus,
    paymentMethod,
    shippingStatus,
    orderStatus,
  };
  if (shoppingCart.discount_code_applied && shoppingCart.discount_code) {
    orderData.discountCodeAmount = shoppingCart.discount_code_amount;
    orderData.discountCodes = [shoppingCart.discount_code];
    orderData.isApplyDiscountCode = true;
  }

  return orderData;
};
