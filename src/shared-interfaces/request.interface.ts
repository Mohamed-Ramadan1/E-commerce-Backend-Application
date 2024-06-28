import { Request } from "express";
import { IProduct } from "../models/product.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { IUser } from "../models/user.interface";
import { ICartItem } from "../models/cartItem.interface";
import { Types, Schema } from "mongoose";

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
  headers: {
    authorization: string;
  };
}

export interface AuthUserRequest extends Request {
  user: IUser;
  headers: {
    authorization: string;
  };
}

export interface RequestWithUser extends Request {
  body: IUser;
}

export interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

export interface ResetPasswordRequest extends Request {
  body: {
    password: string;
    passwordConfirmation: string;
  };
  params: {
    token: string;
  };
}

export interface RequestWithMongoDbId extends Request {
  user?: IUser;
  params: {
    id: string;
  };
}

export interface RequestWithProduct extends Request {
  body: IProduct;
}

export interface DecrementProductQuantityRequest extends AuthUserRequest {
  body: {
    productId: Types.ObjectId;
    quantity: number;
  };
}

export interface RequestWithProductAndUser extends Request {
  user: IUser;
  userShopCart: IShoppingCart;
  product: IProduct;
  userShoppingCartItem: ICartItem | null;
  body: {
    productId: Types.ObjectId;
    quantity: number;
    discount?: number;
  };
  headers: {
    authorization: string;
  };
  params: {
    id: string;
  };
}

export interface RequestUpdateUserPassword extends Request {
  user: IUser;
  headers: {
    authorization: string;
  };
  body: {
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
  };
}

export interface CheckoutRequest extends Request, AuthUserRequest {
  user: IUser;
  shoppingCart: IShoppingCart;
  shipAddress: string;
  headers: {
    authorization: string;
  };

  body: {
    shippingAddress?: string;
  };
}

export interface ReviewRequest extends Request {
  user: IUser;
  headers: {
    authorization: string;
  };
  body: {
    rating?: number;
    comment?: string;
    productId?: Types.ObjectId;
  };
  params: {
    id?: string;
  };
}

export interface AuthUserRequestWithID extends AuthUserRequest {
  params: {
    id: string;
  };
}

export interface SupportTicketRequest extends AuthUserRequest {
  body: {
    subject: string;
    description: string;
    category: string;
  };
}
export interface ReturnItemsRequest extends AuthUserRequest {
  returnedProduct: ICartItem;
  body: {
    orderId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    quantity: number;
    returnReason: string;
    comments?: string;
  };
  params: {
    id?: string;
  };
}
