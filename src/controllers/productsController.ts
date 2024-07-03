// system imports
import { NextFunction, Request, Response } from "express";

// models imports
import Product from "../models/productModel";

// interface imports
import { IProduct } from "../models/product.interface";
import { ApiResponse } from "../shared-interfaces/response.interface";
import {
  RequestWithMongoDbId,
  RequestWithProduct,
} from "../shared-interfaces/request.interface";

// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import { sendResponse } from "../utils/sendResponse";

// get all products
export const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products: IProduct[] | null = await Product.find();
    const response: ApiResponse<IProduct[]> = {
      status: "success",
      results: products.length,
      data: products,
    };

    sendResponse(200, response, res);
  }
);

// get product by id
export const getProduct = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const product: IProduct | null = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const response: ApiResponse<IProduct | null> = {
      status: "success",
      data: product,
    };

    sendResponse(200, response, res);
  }
);

// create a new product
export const createProduct = catchAsync(
  async (req: RequestWithProduct, res: Response, next: NextFunction) => {
    const product: IProduct | null = await Product.create(req.body);
    if (!product) {
      return next(new AppError("something went wrong", 400));
    }

    const response: ApiResponse<IProduct> = {
      status: "success",
      data: product,
    };

    sendResponse(201, response, res);
  }
);

// update product
export const updateProduct = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const response: ApiResponse<IProduct | null> = {
      status: "success",
      data: product,
    };

    sendResponse(200, response, res);
  }
);

// delete product
export const deleteProduct = catchAsync(
  async (req: RequestWithMongoDbId, res: Response, next: NextFunction) => {
    const product: IProduct | null = await Product.findByIdAndDelete(
      req.params.id
    );
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const response: ApiResponse<null> = {
      status: "success",
      data: null,
    };

    sendResponse(204, response, res);
  }
);
