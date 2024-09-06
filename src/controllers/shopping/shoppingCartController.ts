// system imports
import { Response, NextFunction } from "express";

// modals imports
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import CartItem from "../../models/cartItem/cartItemModel";

// interface imports
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { ShoppingCartRequest } from "../../shared-interfaces/shoppingCartRequest.interface";
// utils imports
import catchAsync from "../../utils/catchAsync";
import AppError from "../../utils/ApplicationError";
import APIFeatures from "../../utils/apiKeyFeature";
import { sendResponse } from "../../utils/sendResponse";
import { createAndAssignShoppingCart } from "../../utils/shoppingCartUtils/createAndAssignShoppingCart";

//-------------------------
// Admin Basics operations on the shopping cart

// get all shopping carts
export const getAllShoppingCarts = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(ShoppingCart.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const shoppingCarts: IShoppingCart[] = await features.execute();
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

// get current user shopping cart
export const getShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const userShopCart: IShoppingCart | null = await ShoppingCart.findOne({
      user: req.user._id,
    });

    if (!userShopCart) {
      await createAndAssignShoppingCart(req.user);
      return next(
        new AppError(
          "Your shopping cart not exits we created a shopping cart for you please tray again and if the problem still exits contact support.",
          400
        )
      );
    }

    const response: ApiResponse<IShoppingCart> = {
      status: "success",
      data: userShopCart,
    };
    sendResponse(200, response, res);
  }
);

// adding item to the shopping cart.
export const addItemToShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // get required data from request
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

// remove item from shopping cart
export const removeItemFromShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const { userShopCart, userShoppingCartItem } = req;

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

// Decrease shopping cart items quantity
export const decreaseItemQuantity = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const { userShoppingCartItem } = req;
    const { quantity } = req.body;

    if (
      userShoppingCartItem.quantity === 1 ||
      userShoppingCartItem.quantity <= quantity ||
      userShoppingCartItem.quantity - quantity === 0
    ) {
      await CartItem.findByIdAndDelete(userShoppingCartItem._id);
    }

    if (userShoppingCartItem.quantity > quantity) {
      userShoppingCartItem.quantity -= quantity;
      await userShoppingCartItem.save();
    }

    const userShopCart: IShoppingCart | null = await ShoppingCart.findById(
      req.user.shoppingCart
    );

    if (!userShopCart) {
      return next(
        new AppError("Something went wrong with your shopping-Cart", 404)
      );
    }
    userShopCart.calculateTotals();
    await userShopCart.save();

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product quantity updated successfully",
    };
    sendResponse(200, response, res);
  }
);

// clear the shopping cart.
export const clearShoppingCart = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // start a transaction
    const session = await ShoppingCart.startSession();
    session.startTransaction();

    try {
      // clear the user shopping cart and cart items
      const userShopCart: IShoppingCart | null =
        await ShoppingCart.findOneAndUpdate(
          { user: req.user._id },
          {
            $set: {
              items: [],
              total_quantity: 0,
              total_discount: 0,
              total_price: 0,
              total_shipping_cost: 0,
              payment_status: "pending",
              payment_method: "cash",
            },
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
      const result = await CartItem.deleteMany(
        {
          cart: req.user.shoppingCart,
        },
        { session }
      );
      if (!result.acknowledged) {
        await session.abortTransaction();
        return next(new AppError("Failed to clear the shopping cart", 400));
      }

      // commit the transaction
      await session.commitTransaction();

      // send the response
      const response: ApiResponse<IShoppingCart> = {
        status: "success",
        data: userShopCart,
      };

      sendResponse(200, response, res);
    } catch (err: any) {
      await session.abortTransaction();
      return next(
        new AppError(err.message || "Failed to clear the shopping cart", 500)
      );
    } finally {
      session.endSession();
    }
  }
);
