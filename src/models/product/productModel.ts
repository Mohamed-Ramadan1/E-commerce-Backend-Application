import mongoose, { Schema, Model } from "mongoose";

import {
  IProduct,
  ProductSourceType,
  ProductCategory,
  AvailabilityStatus,
} from "./product.interface";
import { IShop } from "../shop/shop.interface";
import sendProductUnavailableEmail from "../../emails/shop/productOutOfStockNotification";
import sendProductOutOfStockAdminEmail from "../../emails/admins/sendProductOutOfStockAdminEmail";

export const productSchema: Schema<IProduct> = new Schema(
  {
    sourceType: {
      type: String,
      enum: Object.values(ProductSourceType),
      required: true,
      default: ProductSourceType.Website,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    name: {
      type: String,
      required: [true, "product should have a name"],
    },
    description: {
      type: String,
      required: [true, "provide description for the product is required."],
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    brand: {
      type: String,
      required: [true, "Please provide the brand name"],
    },
    price: {
      type: Number,
      required: [true, "please provide price for your product"],
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountCodes: {
      type: [String],
      default: [],
    },
    stock_quantity: {
      type: Number,
      required: [
        true,
        "please provide the exact number of available stock quantity for your product",
      ],
    },
    images: {
      type: [String],
      required: [true, "please provide images for your product"],
    },
    videos: {
      type: [String],
    },
    color: {
      type: String,
    },
    material: {
      type: String,
      required: true,
    },

    averageRating: {
      type: Number,
      required: true,
      default: 4.5,
    },

    totalReviews: {
      type: Number,
      required: true,
      default: 0,
    },

    shipping_cost: {
      type: Number,
    },

    shipping_methods: {
      type: [String],
      default: ["standard"],
    },
    availability_status: {
      type: String,
      required: true,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.Available,
    },
    manufacturer: {
      type: String,
    },
    supplier: {
      type: String,
    },
    freezed: {
      type: Boolean,
      default: false,
    },
    return_policy: {
      type: String,
      required: true,
      default: "30-days return policy",
    },
  },
  { timestamps: true }
);
// ProductSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ availability_status: 1 });

productSchema.pre<IProduct>("save", function (next) {
  if (this.stock_quantity <= 0) {
    this.availability_status = AvailabilityStatus.Unavailable;
  }
  next();
});

productSchema.post<IProduct>("save", async function (doc) {
  if (doc.stock_quantity <= 0) {
    if (doc.sourceType === ProductSourceType.Shop) {
      try {
        const shop = await mongoose
          .model<IShop>("Shop")
          .findById(doc.shopId)
          .exec();
        if (shop) {
          await sendProductUnavailableEmail(doc, shop);
        } else {
          console.error(`Shop with ID ${doc.shopId} not found`);
        }
      } catch (error) {
        console.error("Error sending product out of stock email", error);
      }
    } else if (doc.sourceType === ProductSourceType.Website) {
      try {
        await sendProductOutOfStockAdminEmail(doc);
      } catch (error) {
        console.error(
          "Error sending product out of stock email to admin",
          error
        );
      }
    }
  }
});
const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
