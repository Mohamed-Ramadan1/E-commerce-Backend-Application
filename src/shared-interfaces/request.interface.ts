import { Request } from "express";
import { IProduct } from "../models/product.interface";
import { IUser } from "../models/user.interface";

import { Types } from "mongoose";
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

export interface RequestWithMongoDbId extends Request {
  params: {
    id: string;
  };
}

export interface RequestWithProduct extends Request {
  body: IProduct;
}

export interface RequestWithProductAndUser extends Request {
  user: IUser;
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
