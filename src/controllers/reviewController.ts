// system imports
import { NextFunction, Response } from "express";

// models imports
import Review from "../models/reviewModel";
// interface imports
import { ReviewRequest } from "../shared-interfaces/request.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import { IReview } from "../models/review.interface";

// utils imports
import AppError from "../utils/ApplicationError";
import catchAsync from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

export const getReviews = catchAsync(
  async (req: ReviewRequest, res: Response, next: NextFunction) => {
    const reviews: IReview[] | null = await Review.find({ user: req.user._id });
    const response: ApiResponse<IReview[]> = {
      status: "success",
      results: reviews.length,
      data: reviews,
    };
    sendResponse(200, response, res);
  }
);
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
