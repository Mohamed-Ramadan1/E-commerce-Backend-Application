// system imports
import { Response, NextFunction } from "express";

// modals imports
import ShoppingCart from "../models/shoppingCartModel";
import CartItem from "../models/cartItemModel";

// interface imports
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IShoppingCart } from "../models/shoppingCart.interface";
import { ICartItem } from "../models/cartItem.interface";
import { ShoppingCartRequest } from "../shared-interfaces/shoppingCartRequest.interface";
// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

//-------------------------
// Admin Basics operations on the shopping cart

// get all shopping carts
export const getAllShoppingCarts = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const shoppingCarts: IShoppingCart[] = await ShoppingCart.find();
    const response: ApiResponse<IShoppingCart[]> = {
      status: "success",
      results: shoppingCarts.length,
      data: shoppingCarts,
    };
    sendResponse(200, response, res);
  }
);

// get a single shopping cart
export const getShoppingCartById = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const shoppingCart: IShoppingCart | null = await ShoppingCart.findById(
      req.params.id
    );
    if (!shoppingCart) {
      return next(new AppError("Shopping cart not found", 404));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: shoppingCart,
    };
    sendResponse(200, response, res);
  }
);

// delete a shopping cart
export const deleteShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const shoppingCart: IShoppingCart | null =
      await ShoppingCart.findByIdAndDelete(req.params.id);
    if (!shoppingCart) {
      return next(new AppError("Shopping cart not found", 404));
    }
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      message: "Shopping cart deleted successfully",
    };
    sendResponse(204, response, res);
  }
);

// update a shopping cart
export const updateShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const shoppingCart: IShoppingCart | null =
      await ShoppingCart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!shoppingCart) {
      return next(
        new AppError("Shopping cart not found with provided id", 404)
      );
    }

    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: shoppingCart,
    };
    sendResponse(200, response, res);
  }
);

//----------------------------------------------------------
// User Operations
export const getShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
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
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // get required data from request body.
    const { productId, quantity } = req.body;

    const { userShopCart, product, userShoppingCartItem } = req;

    // if the product is exist on the user cart increase the quantity by the given quantity
    if (userShoppingCartItem) {
      userShoppingCartItem.quantity += quantity;
      await userShoppingCartItem.save();
    }

    // if the product is not exist on the user cart add a new item to the cart with the given quantity
    if (!userShoppingCartItem) {
      const shopCartItem: ICartItem = await CartItem.create({
        cart: req.user.shoppingCart,
        product: productId,
        quantity,
        price: product.price,
      });

      // add the new item to the user cart items array
      userShopCart.items.push(shopCartItem);
      await userShopCart.save();
    }

    // get the updated user cart
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
      data: updatedShopCart,
    };

    sendResponse(200, response, res);
  }
);

export const removeItemFromShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
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
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
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

// clear the shopping cart.
export const clearShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // start a transaction
    const session = await ShoppingCart.startSession();
    session.startTransaction();

    // clear the user shopping cart and cart items
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
          session,
        }
      );
    // check if the user has a shopping cart and clear it
    if (!userShopCart) {
      await session.abortTransaction();
      return next(new AppError("You are not authorized", 401));
    }

    // clear the cart items
    await CartItem.deleteMany(
      {
        cart: req.user.shoppingCart,
      },
      { session }
    );

    // commit the transaction
    await session.commitTransaction();

    // send the response
    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };

    sendResponse(200, response, res);
  }
);
