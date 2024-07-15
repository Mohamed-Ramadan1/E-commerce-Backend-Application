import mongoose, { Schema, Model } from "mongoose";

import { IProduct } from "./product.interface";

export const productSchema: Schema<IProduct> = new Schema(
  {
    sourceType: {
      type: String,
      enum: ["website", "shop"],
      required: true,
      default: "website",
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
      required: true,
      enum: [
        "electronics",
        "fashion",
        "home",
        "health",
        "beauty",
        "sports",
        "toys",
        "books",
        "food",
        "miscellaneous",
        "clothing",
        "accessories",
        "kitchen",
        "outdoor",
        "crafts",
        "office",
        "tools",
        "automotive",
        "baby",
        "jewelry",
        "pets",
        "games",
        "electronics",
        "furniture",
        "appliances",
        "music",
        "movies",
        "software",
        "hardware",
        "services",
        "digital",
        "other",
      ],
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
      enum: ["available", "unavailable"],
      default: "available",
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

productSchema.post("save", function (doc: IProduct) {
  const isInStock: boolean = doc.stock_quantity > 0;
  if (!isInStock) {
    this.availability_status = "unavailable";
    this.save();
  }
  // TODO: implement other logic for product availability status changes, e.g., notifying suppliers
});

const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default Product;
