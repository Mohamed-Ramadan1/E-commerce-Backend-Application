// system imports
import { NextFunction, Response } from "express";

// models imports
import Review from "../../models/review/reviewModel";
// interface imports
import { ReviewRequest } from "../../shared-interfaces/reviewRequest.interface";
import { ApiResponse } from "../../shared-interfaces/response.interface";
import { IReview } from "../../models/review/review.interface";

// utils imports
import AppError from "../../utils/ApplicationError";
import catchAsync from "../../utils/catchAsync";
import APIFeatures from "../../utils/apiKeyFeature";
import { sendResponse } from "../../utils/sendResponse";

// get all reviews created by the user
export const getReviews = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Review.find({ user: req.user._id }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const reviews: IReview[] | null = await features.execute();

    const response: ApiResponse<IReview[]> = {
      status: "success",
      results: reviews.length,
      data: reviews,
    };
    sendResponse(200, response, res);
  }
);

// get review by id
export const getReview = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const review: IReview | null = await Review.findById(req.params.id);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    const response: ApiResponse<IReview> = {
      status: "success",
      data: review,
    };
    sendResponse(200, response, res);
  }
);

// create new review
export const addReview = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    // all validation found on the review middleware.
    const { productId, rating, comment } = req.body;
    const review: IReview = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });
    const response: ApiResponse<IReview> = {
      status: "success",
      data: review,
    };
    sendResponse(201, response, res);
  }
);

// update review
export const updateReview = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const review: IReview | null = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    const response: ApiResponse<IReview> = {
      status: "success",
      data: review,
    };
    sendResponse(200, response, res);
  }
);

// delete review
export const deleteReview = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const review: IReview | null = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!review) {
      return next(new AppError("Review not found", 404));
    }
    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };
    sendResponse(204, response, res);
  }
);

// get all reviews related to product
export const getProductReviews = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Review.find({ product: req.params.productId }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const reviews: IReview[] = await features.execute();

    const response: ApiResponse<IReview[]> = {
      status: "success",
      results: reviews.length,
      data: reviews,
    };
    sendResponse(200, response, res);
  }
);
