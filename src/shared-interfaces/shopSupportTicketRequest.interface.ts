import { IShop } from "../models/shop.interface";
import { IUser } from "../models/user.interface";
import { IShopSupportTicket } from "../models/shopSupportTicket.interface";
import { AuthUserRequest } from "./request.interface";

export interface ShopSupportTicketRequest extends AuthUserRequest {
  body: {
    subject: string;
    description: string;
    category: string;
    img?: string;
    ticketResponse: string;
    userId: string;
    shopId: string;
    status: string;
  };
  params: {
    ticketId: string;
    shopId: string;
  };
  shop: IShop;
  userToCreateTicket: IUser;
  ticket: IShopSupportTicket;
  shopOwner: IUser;
}
