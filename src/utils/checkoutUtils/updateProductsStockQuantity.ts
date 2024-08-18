import { NextFunction } from "express";
import { IShoppingCart } from "../../models/shoppingCart.interface";

// update the stock quantity after the order created.
export const updateProductsStockQuantity = async (
  userShopCart: IShoppingCart,
  next: NextFunction
) => {
  // Iterate through the items and update the stock quantities
  for (const cartItem of userShopCart.items) {
    const product = cartItem.product;
    if (product) {
      product.stock_quantity -= cartItem.quantity;
      if (product.stock_quantity < 0) {
        product.stock_quantity = 0; // Ensure stock quantity doesn't go negative
      }
      await product.save();
    }
  }
};
