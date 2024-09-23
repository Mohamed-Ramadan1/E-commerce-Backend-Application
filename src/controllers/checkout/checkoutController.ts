// system imports
import { Response, NextFunction } from "express";

// interface imports
import {
  IOrder,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  ShippingStatus,
} from "../../models/order/order.interface";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { CheckoutRequest } from "../../requestsInterfaces/checkout/checkoutRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { createOrderObject } from "../../utils/checkoutUtils/createOrderObject";
import { groupItemsByShop } from "../../utils/checkoutUtils/groupShopCartItemsBySource";
import { GroupedItems } from "../../utils/checkoutUtils/createSupOrders";
import { processCheckout } from "../../utils/checkoutUtils/processCheckout";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import Stripe from "stripe";
// modules imports



// checkout with cash
export const checkoutWithCash = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    //extract the shipping address, shopping cart and user from the request object
    const { shipAddress, shoppingCart, user, phoneNumber } = req;

    // create order objects.
    const orderObject = createOrderObject(
      user,
      shoppingCart,
      shipAddress,
      phoneNumber,
      PaymentStatus.PaymentOnDelivery,
      PaymentMethod.Cash,
      ShippingStatus.Pending,
      OrderStatus.Processing
    );

    // groupe the items based on the shop or the website vender type
    const groups = groupItemsByShop(shoppingCart.items);

    const userOrder: IOrder | void = await processCheckout(
      orderObject,
      shoppingCart,
      user,
      groups as GroupedItems
    );

    if (!userOrder) {
      return next(
        new AppError("Something went wrong with processing your order", 500)
      );
    }

    // generate the response object
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: userOrder,
    };

    // send the response
    sendResponse(200, response, res);
  }
);

// checkout with stripe
export const checkoutWithStripe = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    const { shipAddress, shoppingCart, user, phoneNumber } = req;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // create order objects.
    const orderObject = createOrderObject(
      user,
      shoppingCart,
      shipAddress,
      phoneNumber,
      PaymentStatus.Paid,
      PaymentMethod.CreditCard,
      ShippingStatus.Pending,
      OrderStatus.Processing
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      customer_email: user.email,
      line_items: shoppingCart.items.map((item: ICartItem) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.product.name,
            },
            unit_amount: item.product.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    });

    // groupe the items based on the shop or the website vender type
    const groups = groupItemsByShop(shoppingCart.items);

    orderObject.paymentSessionId = session.id;

    const userOrder: IOrder | void = await processCheckout(
      orderObject,
      shoppingCart,
      user,
      groups as GroupedItems
    );

    if (!userOrder) {
      return next(
        new AppError("Something went wrong with processing your order", 500)
      );
    }

    // generate the response object
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: userOrder,
    };

    // send the response
    sendResponse(200, response, res);
  }
);
