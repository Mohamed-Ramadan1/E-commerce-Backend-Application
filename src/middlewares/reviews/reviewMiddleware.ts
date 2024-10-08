import { NextFunction, Response } from "express";

import Product from "../../models/product/productModel";
import Review from "../../models/review/reviewModel";

import { ReviewRequest } from "../../requestsInterfaces/reviews/reviewRequest.interface";
import { IReview } from "../../models/review/review.interface";
import { IProduct } from "../../models/product/product.interface";

import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";

export const validateDataBeforeCreateReview = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return next(
        new AppError(
          "Please provide all required data (product-id , rating)",
          400
        )
      );
    }

    const product: IProduct | null = await Product.findById(productId);
    if (!product) {
      return next(
        new AppError(
          "No product found with this id provide valid id and tray again",
          404
        )
      );
    }
    // check if the product id in teh purchase history or not
    const inPurchaseHistory = req.user.purchaseHistory.includes(productId);
    if (!inPurchaseHistory) {
      return next(
        new AppError(
          "You have to purchase the product to be able to rate it.",
          400
        )
      );
    }

    // check if the user review this product before or not
    const prevRating: IReview | null = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (prevRating) {
      return next(
        new AppError(
          "You already rated this product before in the context to not allow spam ratings you can updated your old rating instead of creating new rate .",
          400
        )
      );
    }
    next();
  }
);
