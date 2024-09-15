import { AuthUserRequest } from "../shared/request.interface";
import { IShop } from "../../models/shop/shop.interface";
import { IUser } from "../../models/user/user.interface";
import { IShopSupportTicket } from "../../models/supportTickets/shopSupportTicket.interface";

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
