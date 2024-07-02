import { Schema, Model, model } from "mongoose";
import { IReview } from "./review.interface";
import Product from "./productModel";

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
// reviewSchema.pre<IReview>("init", async function () {
//   await Review.calcAverageRatings(this.product);
// });

// reviewSchema.post<IReview>("save", function () {
//   Review.calcAverageRatings(this.product);
// });

// reviewSchema.pre<IReview>(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   next();
// });

// reviewSchema.post<IReview>(/^findOneAnd/, async function () {
//   await Review.calcAverageRatings(this.r.product);
// });
const Review: Model<IReview> = model<IReview>("Review", reviewSchema);

export default Review;
