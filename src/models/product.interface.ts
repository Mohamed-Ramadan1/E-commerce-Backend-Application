import { Document, Types } from "mongoose";

export enum ProductSourceType {
  Website = "website",
  Shop = "shop",
}

export enum AvailabilityStatus {
  Available = "available",
  Unavailable = "unavailable",
}

export enum ProductCategory {
  Electronics = "electronics",
  Fashion = "fashion",
  Home = "home",
  Health = "health",
  Beauty = "beauty",
  Sports = "sports",
  Toys = "toys",
  Books = "books",
  Food = "food",
  Miscellaneous = "miscellaneous",
  Clothing = "clothing",
  Accessories = "accessories",
  Kitchen = "kitchen",
  Outdoor = "outdoor",
  Crafts = "crafts",
  Office = "office",
  Tools = "tools",
  Automotive = "automotive",
  Baby = "baby",
  Jewelry = "jewelry",
  Pets = "pets",
  Games = "games",
  Furniture = "furniture",
  Appliances = "appliances",
  Music = "music",
  Movies = "movies",
  Software = "software",
  Hardware = "hardware",
  Services = "services",
  Digital = "digital",
  Other = "other",
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  sourceType: ProductSourceType;
  shopId: Types.ObjectId;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  price: number;
  discount: number;
  discountCodes: string[];
  stock_quantity: number;
  images: string[];
  videos: string[];
  color: string;
  material: string;
  averageRating: number;
  totalReviews: number;
  shipping_cost: number;
  shipping_methods: string[];
  availability_status: AvailabilityStatus;
  manufacturer: string;
  supplier: string;
  return_policy: string;
  freezed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
