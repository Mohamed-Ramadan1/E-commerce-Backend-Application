import { Schema, Model, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema: Schema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Review: Model<IReview> = model<IReview>("Review", reviewSchema);

export default Review;
