import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import ShoppingCart from "../models/shoppingCartModel";
// import CartItem from "../models/cartItemModel";
import { Response, NextFunction } from "express";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { sendResponse } from "../utils/sendResponse";
import { IShoppingCart } from "../models/shoppingCart.interface";
import {
  AuthUserRequest,
  RequestWithProductAndUser,
} from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";

export const getShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const userShopCart = await ShoppingCart.findOne({
      user: req.user._id,
    });

    if (!userShopCart) {
      return next(new AppError("something went wrong", 400));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);

export const addItemToShoppingCart = catchAsync(
  async (req: RequestWithProductAndUser, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;
    const { userShopCart, product, userShoppingCartItem } = req;

    if (userShoppingCartItem) {
      userShoppingCartItem.quantity += quantity;
      await userShoppingCartItem.save();
    }
    if (!userShoppingCartItem) {
      const shopCartItem = await CartItem.create({
        cart: req.user.shoppingCart,
        product: productId,
        quantity,
        price: product.price,
      });
      userShopCart.items.push(shopCartItem._id);
      await userShopCart.save();
    }
    const updatedShopCart: IShoppingCart | null = await ShoppingCart.findById(
      req.user.shoppingCart
    );
    if (!updatedShopCart) {
      return next(new AppError("something went wrong", 400));
    }
    updatedShopCart.calculateTotals();
    updatedShopCart.save();

    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      results: 1,
      data: updatedShopCart,
    };
    sendResponse(200, response, res);
  }
);

export const removeItemFromShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const shoppingCartId = req.user.shoppingCart;

    // Find the user's shopping cart
    const userShopCart = await ShoppingCart.findById(shoppingCartId);
    if (!userShopCart) {
      return next(new AppError("Shopping cart not found", 400));
    }

    // Find the cart item to be removed
    const userShoppingCartItem = await CartItem.findOne({
      cart: shoppingCartId,
      product: req.params.productId,
    });
    if (!userShoppingCartItem) {
      return next(new AppError("Product not found in the shopping cart", 404));
    }

    // Delete the cart item
    await CartItem.findByIdAndDelete(userShoppingCartItem._id);

    // Remove the item from the shopping cart's items array
    userShopCart.items = userShopCart.items.filter(
      (itemId: any) => !itemId.equals(userShoppingCartItem._id)
    );

    // Calculate and update totals
    userShopCart.calculateTotals();
    await userShopCart.save();

    // Send the updated shopping cart in the response
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);

export const clearShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    console.log(req.user._id);
    const userShopCart = await ShoppingCart.findOneAndUpdate(
      { user: req.user._id },
      {
        items: [],
        total_quantity: 0,
        total_discount: 0,
        total_price: 0,
        total_shipping_cost: 0,
        payment_status: "pending",
        payment_method: "cash",
      },
      {
        new: true,
      }
    );
    await CartItem.deleteMany({
      cart: req.user.shoppingCart,
    });
    if (!userShopCart) {
      return next(new AppError("You are not authorized", 401));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);
