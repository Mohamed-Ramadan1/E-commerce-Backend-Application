// src/express.d.ts
import { Request } from "express";
import { UserDocument } from "./models/userModel"; // Adjust the path and import according to your project

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // Assuming UserDocument is the type representing your user model
    }
  }
}
