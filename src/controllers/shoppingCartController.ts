import catchAsync from "../utils/catchAsync";
import ShoppingCart from "../models/shoppingCartModel";
import CartItem from "../models/cartItemModel";
import { Request, Response, NextFunction } from "express";
import {
  AuthUserRequest,
  RequestWithProductAndUser,
} from "../shared-interfaces/request.interface";

export const getShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {}
);

export const addItemToShoppingCart = catchAsync(
  async (req: RequestWithProductAndUser, res: Response, next: NextFunction) => {
    // product id ,quantity
    //1) cheack if the item is exist on the cartItem collection
    //2) if the item exist update the quantity based on the quantity that is passed in the request or updatae by one if it not exist
    //3) if not create new item in the cartItem collection and add the product id to the product field on the shoping cart
    //4)send response
  }
);
export const removeItemFromShoppingCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
export const clearShoppingCart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
