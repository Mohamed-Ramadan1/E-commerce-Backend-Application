import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  discount: number;
  stock_quantity: number;
  images: string[];
  videos: string[];
  color: string;
  material: string;
  averageRating: number;
  totalReviews: number;
  shipping_cost: number;
  shipping_methods: string[];
  availability_status: string;
  manufacturer: string;
  supplier: string;
  return_policy: string;
}
