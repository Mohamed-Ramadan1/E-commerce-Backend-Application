import ShopOrder from "../../models/shopOrderModal";
import Shop from "../../models/shopModal";
import Notification from "../../models/notificationModal";

import { IShopOrder, VendorType } from "../../models/shopOrder.interface";
import { ICartItem } from "../../models/cartItem.interface";

import sendShopOrderEmail from "../../emails/shop/sendShopOrderEmail";
import sendWebsiteAdminOrderEmail from "../../emails/admins/sendWebsiteAdminOrderEmail";

import { ObjectId } from "mongoose";
import { IOrder } from "../../models/order.interface";
import { IShop } from "../../models/shop.interface";
import {
  INotification,
  NotificationType,
} from "../../models/notification.interface";
import { getIO } from "../socketSetup";

export interface GroupedItems {
  shopOrders?:
    | {
        shopId: ObjectId;
        items: ICartItem[];
      }[]
    | never[];
  websiteItems?: ICartItem[];
}

interface SubOrderBasicDetails {
  mainOrder: ObjectId;
  user: ObjectId;
  vendorType: VendorType;
  items: ICartItem[];
  itemsQuantity: number;
  subtotalPrice: number;
  totalDiscount: number;
  netPrice: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingStatus: string;
  shippingAddress: string;
  orderStatus: string;
  discountCodes?: string[];
}

interface ShopOrderDetails extends SubOrderBasicDetails {
  shop: ObjectId | undefined;
  platformFee: number | undefined;
}

interface SubOrderOptionalDetails {
  shopId?: ObjectId;
  platformFee?: number;
}

const createSubOrderObject = (
  mainOrder: IOrder,
  vendorType: VendorType,
  orderItems: ICartItem[],
  totalPrice: number,
  totalDiscount: number,
  netPrice: number,
  optionalDetails?: SubOrderOptionalDetails
) => {
  const baseDetails: SubOrderBasicDetails = {
    mainOrder: mainOrder._id,
    user: mainOrder.user,
    vendorType: vendorType,
    items: orderItems,
    itemsQuantity: orderItems.length,
    subtotalPrice: totalPrice,
    totalDiscount: totalDiscount,
    netPrice: netPrice,
    paymentStatus: mainOrder.paymentStatus,
    paymentMethod: mainOrder.paymentMethod,
    shippingStatus: mainOrder.shippingStatus,
    shippingAddress: mainOrder.shippingAddress,
    orderStatus: mainOrder.orderStatus,
    discountCodes: mainOrder.discountCodes,
  };

  if (optionalDetails) {
    // Ensure that optionalDetails are provided and are valid
    const shopOrderDetails: ShopOrderDetails = {
      ...baseDetails,
      shop: optionalDetails.shopId,
      platformFee: optionalDetails.platformFee,
    };

    // Return the details with additional fields
    return shopOrderDetails as ShopOrderDetails;
  } else {
    // Return basic details if no optional details are provided
    return baseDetails as SubOrderBasicDetails;
  }
};

// Function to create and emit a notification
async function createShopOrderNotification(
  shopId: ObjectId,
  order: IShopOrder
): Promise<void> {
  try {
    // Create a new notification
    const orderNotification: INotification = await Notification.create({
      user: shopId,
      message: `You have received a new order (Order ID: ${order._id}). You can view the order details on your shop orders section.`,
      type: NotificationType.Order,
    });

    // Get Socket.IO instance and emit the notification
    const io = getIO();
    io.to(shopId.toString()).emit("notification", {
      type: "NEW_NOTIFICATION",
      payload: orderNotification,
    });
  } catch (error) {
    console.error(
      "Error creating and emitting shop order notification:",
      error
    );
    // Handle the error appropriately
  }
}

export const createSubOrders = async (
  groupedItems: GroupedItems,
  mainOrder: IOrder
) => {
  const shopOrders = groupedItems.shopOrders || [];
  const websiteItems = groupedItems.websiteItems || [];

  // groupe the the all shops ids
  const shopsIds: ObjectId[] = shopOrders.map((shopOrder) => shopOrder.shopId);

  // get the all shops
  const shops: IShop[] = await Shop.find({ _id: { $in: shopsIds } });

  const subOrders: IShopOrder[] = [];

  for (const shopOrder of shopOrders) {
    const orderItems: ICartItem[] = shopOrder.items;

    // calculate the totals
    const totalPrice: number = orderItems.reduce(
      (acc, item) => acc + item.priceAfterDiscount * item.quantity,
      0
    );
    const totalDiscount: number = orderItems.reduce(
      (acc, item) => acc + item.discount * item.quantity,
      0
    );

    const priceAfterDiscount: number = totalPrice - totalDiscount;

    const platformFee: number = 0.1 * priceAfterDiscount;

    const netPrice: number = priceAfterDiscount - platformFee;

    const subOrder: ShopOrderDetails = createSubOrderObject(
      mainOrder,
      VendorType.SHOP,
      orderItems,
      totalPrice,
      totalDiscount,
      netPrice,
      { shopId: shopOrder.shopId, platformFee }
    ) as ShopOrderDetails;

    subOrders.push(subOrder as IShopOrder);
  }

  for (const item of websiteItems) {
    // calculate the totals
    const totalPrice: number = item.priceAfterDiscount * item.quantity;

    const totalDiscount: number = item.discount * item.quantity;

    const netPrice: number = totalPrice - totalDiscount;

    const subOrder: SubOrderBasicDetails = createSubOrderObject(
      mainOrder,
      VendorType.WEBSITE,
      [item], // website items are handled individually
      totalPrice,
      totalDiscount,
      netPrice
    );

    subOrders.push(subOrder as IShopOrder);
  }
  const newSubOrders: IShopOrder[] = await ShopOrder.insertMany(subOrders);

  // iterate throw the suborders and send the email to the shop owner with his order details
  for (const order of newSubOrders) {
    // send shop email to the shop owner with his order details
    if (order.vendorType === VendorType.SHOP) {
      const shopDetails: IShop | undefined = shops.find(
        (shop) => shop._id.toString() === order.shop?.toString()
      );
      if (shopDetails) {
        sendShopOrderEmail(shopDetails, order);
        await createShopOrderNotification(shopDetails._id, order);
      } else {
        console.error(`Shop details not found for shop ID: ${order.shop}`);
      }
    }
    // If the website order is created, send an email to the website admin
    if (order.vendorType === VendorType.WEBSITE) {
      sendWebsiteAdminOrderEmail(order);
    }
  }
};
