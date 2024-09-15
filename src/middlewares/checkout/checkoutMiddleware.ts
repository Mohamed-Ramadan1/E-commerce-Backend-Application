import { Response, NextFunction } from "express";
import ShoppingCart from "../../models/shoppingCart/shoppingCartModel";
import AppError from "../../utils/apiUtils/ApplicationError";
import { CheckoutRequest } from "../../requestsInterfaces/checkout/checkoutRequest.interface";
import catchAsync from "../../utils/apiUtils/catchAsync";
import { IUser } from "../../models/user/user.interface";
import { IShoppingCart } from "../../models/shoppingCart/shoppingCart.interface";

const validateUser = (req: CheckoutRequest): string[] => {
  if (!req.user.active || !req.user.verified) {
    throw new AppError("User not active or not verified", 403);
  }

  // check if the user provided a shipping address on the request or on his account or not
  const shipAddress: string | undefined =
    req.user.shippingAddress || req.body.shippingAddress;

  if (!shipAddress) {
    throw new AppError(
      "Please provide a shipping address or add shipping address to your profile ",
      400
    );
  }

  // validate if the use provide a phone number or not
  const phoneNumber: string | undefined =
    req.user.phoneNumber || req.body.phoneNumber;
  if (!phoneNumber) {
    throw new AppError(
      "Please provide a phone number or add phone number to your profile ",
      400
    );
  }
  return [shipAddress, phoneNumber];
};

// get and return the user shopping cart
const validateUserShoppingCart = async (
  user: IUser
): Promise<IShoppingCart> => {
  const userShopCart = await ShoppingCart.findById(user.shoppingCart);
  // check if the user not have a shop cart and if not create and assign new one .
  if (!userShopCart) {
    const newShopCart = await ShoppingCart.create({
      user: user._id,
    });

    user.shoppingCart = newShopCart;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      "your shopping cart was not exist we created on and assigned to you please now fill your cart with the items and checkout .",
      500
    );
  }

  // check if the cart is empty
  if (userShopCart.items.length === 0) {
    throw new AppError(
      "Your shopping cart is empty please add items before you checkout.",
      400
    );
  }
  return userShopCart;
};

// validate the shopping cart products stock quantity level
const validateShoppingCartProducts = (userShopCart: IShoppingCart): void => {
  // retrieve the products from the cart items and check if the product is available in the stock or not
  for (const cartItem of userShopCart!.items) {
    const product = cartItem.product;

    if (!product || product.stock_quantity < cartItem.quantity) {
      throw new AppError(
        `The product ${
          product?.name || "unknown product"
        } is out of stock or does not have sufficient quantity`,
        400
      );
    }
  }
};

export const checkCartAvailability = catchAsync(
  async (req: CheckoutRequest, res: Response, next: NextFunction) => {
    //validate if user is active and verified
    const [shipAddress, phoneNumber] = validateUser(req);

    // get the user shop cart
    const userShopCart = await validateUserShoppingCart(req.user);

    // validate the shopping cart products stock quantity level
    validateShoppingCartProducts(userShopCart);

    // pass the shopping cart and the shipping address to the request object
    req.shoppingCart = userShopCart;
    req.shipAddress = shipAddress;
    req.phoneNumber = phoneNumber;

    next();
  }
);
