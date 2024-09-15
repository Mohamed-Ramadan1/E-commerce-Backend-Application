import { Response, NextFunction } from "express";

import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import Product from "../../models/product/productModel";
import CartItem from "../../models/cartItem/cartItemModel";

import { createAndAssignShoppingCart } from "../../utils/shoppingCartUtils/createAndAssignShoppingCart";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";
import { ICartItem } from "../../models/cartItem/cartItem.interface";
import { IProduct } from "../../models/product/product.interface";
import { ShoppingCartRequest } from "../../requestsInterfaces/shoppingCart/shoppingCartRequest.interface";

import AppError from "../../utils/apiUtils/ApplicationError";
import catchAsync from "../../utils/apiUtils/catchAsync";

const validateProductExistAndStockLevel = async (
  req: ShoppingCartRequest
): Promise<IProduct> => {
  const { productId, quantity } = req.body;

  // check required data exist
  if (!productId || !quantity) {
    throw new AppError("productId and quantity are required", 400);
  }

  // check if the product exists with the given id.
  const product: IProduct | null = await Product.findById(productId);

  // check if the product exists
  if (!product) {
    throw new AppError("No product fount with given id .", 404);
  }

  // check if the product stock quantity is less than the required quantity
  if (product.stock_quantity < quantity) {
    throw new AppError(
      "Product stock quantity  less than your required quantity",
      400
    );
  }
  return product;
};

const validateUserShoppingCart = async (
  req: ShoppingCartRequest
): Promise<IShoppingCart> => {
  // check if the user has a shopping cart
  const userShopCart: IShoppingCart | null = await ShoppingCart.findById(
    req.user.shoppingCart
  );

  // check if the user has a shopping cart
  if (!userShopCart) {
    await createAndAssignShoppingCart(req.user);

    throw new AppError(
      "something went wrong with your shopping cart please tray again",
      500
    );
  }
  return userShopCart;
};

const validateProductInUserCartExist = async (
  req: ShoppingCartRequest,
  product: IProduct
): Promise<ICartItem | null> => {
  const { productId, quantity } = req.body;

  // check if the user has the product in his cart
  const userShoppingCartItem: ICartItem | null = await CartItem.findOne({
    cart: req.user.shoppingCart,
    product: productId,
  });

  // check if the user has the product in his cart and the quantity is greater than the stock quantity
  if (
    userShoppingCartItem &&
    userShoppingCartItem.quantity + quantity > product.stock_quantity
  ) {
    throw new AppError(
      " stock quantity  less than your required quantity",
      400
    );
  }

  return userShoppingCartItem;
};

export const checkItemValidity = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // get required data from request body.
    const { productId, quantity } = req.body;

    // validate the product and get its information
    const product = await validateProductExistAndStockLevel(req);

    // validate the user's shopping cart and get its information( if not exist will create and assign a new one).
    const userShopCart = await validateUserShoppingCart(req);

    // validate if the user has the product in his cart and the quantity is greater than the stock quantity
    const userShoppingCartItem = await validateProductInUserCartExist(
      req,
      product
    );

    if (userShoppingCartItem) {
      req.userShoppingCartItem = userShoppingCartItem;
    }

    req.product = product;
    req.userShopCart = userShopCart;

    next();
  }
);

export const validateBeforeRemoveItem = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    // validate the user's shopping cart and get its information( if not exist will create and assign a new one).
    const userShopCart = await validateUserShoppingCart(req);

    // Find the cart item to be removed
    const userShoppingCartItem: ICartItem | null = await CartItem.findOne({
      cart: req.user.shoppingCart,
      product: req.params.productId,
    });

    if (!userShoppingCartItem) {
      return next(new AppError("Product not found in the shopping cart", 404));
    }

    req.userShopCart = userShopCart;
    req.userShoppingCartItem = userShoppingCartItem;
    next();
  }
);

export const validateBeforeDecrementItem = catchAsync(
  async (req: ShoppingCartRequest, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return next(new AppError("Product id and quantity are required", 400));
    }
    const shoppingCartItem: ICartItem | null = await CartItem.findOne({
      cart: req.user.shoppingCart,
      product: productId,
    });

    if (!shoppingCartItem) {
      return next(new AppError("Product not found in the shopping cart ", 404));
    }

    if (shoppingCartItem.quantity < quantity) {
      return next(
        new AppError(
          "Quantity to decrement must be less than or equal to current quantity",
          400
        )
      );
    }

    req.userShoppingCartItem = shoppingCartItem;
    next();
  }
);
