// system imports
import { NextFunction, Response } from "express";
import mongoose from "mongoose";
// models imports
import Order from "../../models/order/orderModel";

// interface imports
import {
  IOrder,
  OrderStatus,
  ShippingStatus,
} from "../../models/order/order.interface";

import { ApiResponse } from "../../RequestsInterfaces/response.interface";
import { OrderRequest } from "../../RequestsInterfaces/orderRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { createRefundRequest } from "../../utils/orderUtils/createOrderRefundRequest";
import { updateSubOrdersState } from "../../utils/orderUtils/updateSubOrderStatus";
import { updateSubOrderShippingStatus } from "../../utils/orderUtils/updateSubOrderShippingStatus";
import { delverSubOrders } from "../../utils/orderUtils/delverSubOrders";
import { updateShopsBalance } from "../../utils/orderUtils/updateShopsBalance";

// emails imports
import confirmOrderShippedSuccessfully from "../../emails/admins/shippingOrderEmail";
import confirmOrderDelivered from "../../emails/admins/deliverOrderEmail";
import confirmOrderCancellation from "../../emails/admins/adminOrderCancellationOrdreConfirmation";
import { updateUserLoyaltyPoints } from "../../utils/orderUtils/updateUserLoyaltyPoints";

//get All Orders
export const getOrders = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const apiFeatures = new APIFeatures(Order.find(), req.query);

    const orders: IOrder[] = await apiFeatures.execute();

    const response: ApiResponse<IOrder[]> = {
      status: "success",
      results: orders.length,
      data: orders,
    };
    sendResponse(200, response, res);
  }
);

//Get Order by ID
export const getOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order: IOrder | null = await Order.findById(id);
    if (!order) {
      return next(new AppError("Order not found", 404));
    }
    const response: ApiResponse<IOrder> = {
      status: "success",
      data: order,
    };
    sendResponse(200, response, res);
  }
);

//cancel the order
export const cancelOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { order, userOrderOwner } = req;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      order.orderStatus = OrderStatus.Cancelled;
      await order.save({ session });

      await updateSubOrdersState(order, session, OrderStatus.Cancelled);

      if (
        order.paymentMethod === "credit_card" &&
        order.paymentStatus === "paid"
      ) {
        await createRefundRequest(userOrderOwner, session, order);
      }

      // check if the user use his gitCard balance to pay any part of the order price amount and return it back to his account.
      if (order.paidAmountWithUserGiftCard !== 0) {
        userOrderOwner.giftCard += order.paidAmountWithUserGiftCard;
        await userOrderOwner.save({ validateBeforeSave: false, session });
      }

      confirmOrderCancellation(userOrderOwner, order);

      await session.commitTransaction();

      const response: ApiResponse<IOrder> = {
        status: "success",
        message: "Order cancelled successfully",
      };
      sendResponse(200, response, res);
    } catch (error) {
      console.error("Error cancelling order:", error);
      await session.abortTransaction();
      throw new AppError("Error cancelling order", 500);
    } finally {
      session.endSession();
    }
  }
);

//Update Order Status to shipped
export const updateOrderStatusToShipped = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { order, userOrderOwner } = req;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      order.shippingStatus = ShippingStatus.Shipped;
      await order.save({ session });

      await updateSubOrderShippingStatus(
        order,
        session,
        ShippingStatus.Shipped
      );

      // send shipping confirmation email
      confirmOrderShippedSuccessfully(userOrderOwner, order);

      await session.commitTransaction();

      const response: ApiResponse<IOrder> = {
        status: "success",
        data: order,
      };
      sendResponse(200, response, res);
    } catch (error) {
      await session.abortTransaction();

      return next(
        new AppError(
          "Error happen while updating the order shipping state",
          500
        )
      );
    } finally {
      session.endSession();
    }
  }
);

//Update Order Status to delivered
export const delverOrder = catchAsync(
  async (req: OrderRequest, res: Response, next: NextFunction) => {
    const { order, userOrderOwner } = req;
    const session = await mongoose.startSession();
    session.startTransaction();
    // update the order

    try {
      order.orderStatus = OrderStatus.Delivered;
      order.shippingStatus = ShippingStatus.Delivered;

      const updatedOrder = await order.save({ session });

      if (!updatedOrder) {
        await session.abortTransaction();
        return next(new AppError("delver order process failed", 500));
      }
      // update the sub orders
      await delverSubOrders(
        order,
        session,
        ShippingStatus.Delivered,
        OrderStatus.Delivered
      );

      await updateUserLoyaltyPoints(userOrderOwner, order, session);
      // check the items come form the shops and add its value (mony value) to the shop balance.
      await updateShopsBalance(order, session);
      // send delivery confirmation email
      confirmOrderDelivered(userOrderOwner, order);

      // commit the transaction
      await session.commitTransaction();

      const response: ApiResponse<IOrder> = {
        status: "success",
        data: order,
      };
      sendResponse(200, response, res);
    } catch (error: any) {
      await session.abortTransaction();
      console.log(error);
      return next(
        new AppError(
          "Error happen while updating the order delivery state",
          500
        )
      );
    } finally {
      session.endSession();
    }
  }
);
