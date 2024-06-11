// src/express.d.ts
import { Request } from "express";

import { IUser } from "../models/user.interface";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
