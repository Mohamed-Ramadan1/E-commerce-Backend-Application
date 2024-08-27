import { Request } from "express";
import { IUser } from "../models/user.interface";

export interface AuthUserRequest extends Request {
  user: IUser;
  headers: {
    authorization: string;
  };
}
