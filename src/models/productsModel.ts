import mongoose, { Schema } from "mongoose";

import { IProduct } from "./products.interface";

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    images: { type: [String], required: true },
    videos: { type: [String], required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
    rating: { type: Number, required: true },
    shipping_cost: { type: Number, required: true },
    shipping_methods: { type: [String], required: true },
    availability_status: { type: String, required: true },
    manufacturer: { type: String, required: true },
    supplier: { type: String, required: true },
    return_policy: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
