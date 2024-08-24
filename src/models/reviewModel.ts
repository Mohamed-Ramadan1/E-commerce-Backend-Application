import { Schema, Model, model, Query } from "mongoose";
import { IReview } from "./review.interface";
import Product from "./productModel";

// Define the Review schema
const reviewSchema: Schema<IReview> = new Schema<IReview>(
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

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function (productId: string) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      totalReviews: stats[0].nRating,
      averageRating: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      totalReviews: 0,
      averageRating: 0,
    });
  }
};

// Post-save hook to calculate average ratings
reviewSchema.post<IReview>("save", function () {
  // 'this' refers to the current review
  (this.constructor as any).calcAverageRatings(this.product);
});

reviewSchema.pre<Query<any, IReview>>(/^findOneAnd/, async function (next) {
  // @ts-ignore
  this.r = await this.findOne();
  next();
});
// Post-findOneAndUpdate hook to calculate average ratings
reviewSchema.post<IReview>(/^findOneAnd/, async function () {
  if (this.r) {
    await (this.r.constructor as any).calcAverageRatings(this.r.product);
  }
});

// Create and export the Review model
const Review: Model<IReview> = model<IReview>("Review", reviewSchema);

export default Review;
