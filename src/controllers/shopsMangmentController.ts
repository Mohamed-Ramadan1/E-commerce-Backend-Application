// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import User from "../models/userModel";
import Shop from "../models/shopModal";

// interfaces imports
import { IUser } from "../models/user.interface";
import { IShop } from "../models/shop.interface";

// utils imports
import catchAsync from "../utils/catchAsync";

/*
TODO: get all shops .
TODO: get shop .
TODO: delete shop .
TODO: update shop .

TODO: un-active shop.
TODO: activate shop.

TODO:  get all products in the shop. 
TODO:  get a single product in the shop.
TODO:  freezing product in the shop.
TODO:  un-freezing product in the shop.

TODO: get all orders created on the shop.
TODO: get a single order created on the shop.

*/
export const getAllShops = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const deleteShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const unActiveShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const activateShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllProductsInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getSingleProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const freezingProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const unfreezingProductInShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getAllOrdersCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const getSingleOrderCreatedOnShop = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
