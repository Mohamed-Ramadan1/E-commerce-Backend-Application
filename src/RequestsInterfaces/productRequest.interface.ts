import { AuthUserRequest } from "./request.interface";
import { IProduct } from "../models/product/product.interface";

export interface ProductRequest extends AuthUserRequest {
  body: IProduct;
  params: {
    id: string;
  };
}
