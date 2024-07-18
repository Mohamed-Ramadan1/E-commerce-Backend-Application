import { IShop } from "../models/shop.interface";
import { IUser } from "../models/user.interface";
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
  };
  params: {
    ticketId: string;
    shopId: string;
  };
  shop: IShop;
  userToCreateTicket: IUser;
}
