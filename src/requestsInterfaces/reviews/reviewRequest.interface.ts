import { AuthUserRequest } from "../shared/request.interface";
import { Types } from "mongoose";

export interface ReviewRequest extends AuthUserRequest {
  body: {
    rating?: number;
    comment?: string;
    productId?: Types.ObjectId;
  };
  params: {
    id: string;
    productId: string;
  };
}
