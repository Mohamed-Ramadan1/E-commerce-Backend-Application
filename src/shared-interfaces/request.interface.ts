import { Request } from "express";
import { IProduct } from "../models/product.interface";
import { IUser } from "../models/user.interface";

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
  headers: {
    authorization: string;
  };
}

export interface LogoutRequest extends Request {
  user: IUser;
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
