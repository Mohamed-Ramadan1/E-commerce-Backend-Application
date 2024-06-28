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
  DecrementProductQuantityRequest,
} from "../shared-interfaces/request.interface";
import CartItem from "../models/cartItemModel";
import { ICartItem } from "../models/cartItem.interface";

export const getShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const userShopCart: IShoppingCart | null = await ShoppingCart.findOne({
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
    const userShopCart: IShoppingCart | null = await ShoppingCart.findById(
      shoppingCartId
    );
    if (!userShopCart) {
      return next(new AppError("Shopping cart not found", 400));
    }

    // Find the cart item to be removed
    const userShoppingCartItem: ICartItem | null = await CartItem.findOne({
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

export const decreaseItemQuantity = catchAsync(
  async (
    req: DecrementProductQuantityRequest,
    res: Response,
    next: NextFunction
  ) => {
    /*
     product id 
     check if hte product exist on the user shoping cart 
      if it exist decrease the quantity by one
    if the quantity is 1 delete the item from the cart
    */
    const { productId, quantity } = req.body;
    const { user } = req;

    if (!productId || !quantity) {
      return next(new AppError("Product id and quantity are required", 400));
    }
    const shoppingCartItem: ICartItem | null = await CartItem.findOne({
      cart: user.shoppingCart,
      product: productId,
    });

    if (!shoppingCartItem) {
      return next(new AppError("Product not found in the shopping cart ", 404));
    }
    if (shoppingCartItem.quantity === 1) {
      await CartItem.findByIdAndDelete(shoppingCartItem._id);
    }
    shoppingCartItem.quantity -= quantity;
    await shoppingCartItem.save();
    const userShopCart: IShoppingCart | null = await ShoppingCart.findById(
      user.shoppingCart
    );

    if (!userShopCart) {
      return next(
        new AppError("Something went wrong with your shopping-Cart", 404)
      );
    }
    userShopCart.calculateTotals();
    await userShopCart.save();

    res.status(200).json({
      status: "success",
      message: "Product quantity updated successfully",
    });
  }
);

export const clearShoppingCart = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    console.log(req.user._id);
    const userShopCart: IShoppingCart | null =
      await ShoppingCart.findOneAndUpdate(
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
