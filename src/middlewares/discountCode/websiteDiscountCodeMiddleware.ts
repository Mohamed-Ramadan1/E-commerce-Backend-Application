// system imports
import { Response, NextFunction } from "express";

// models imports
import Product from "../../models/product/productModel";
import DiscountCode from "../../models/discountCode/discountCodeModel";

// interface imports
import {
  DiscountType,
  IDiscountCode,
} from "../../models/discountCode/discountCode.interface";
import { WebsiteDiscountCodeRequest } from "../../RequestsInterfaces/discountCode/websiteiscountCodeRequest.interface";
import {
  IProduct,
  ProductCategory,
  ProductSourceType,
} from "../../models/product/product.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";

// validate the request body information
const validateBodyData = async (req: WebsiteDiscountCodeRequest) => {
  const { code, discountType, discountValue, startDate, endDate, usageLimit } =
    req.body;
  if (
    !code ||
    !discountType ||
    !discountValue ||
    !startDate ||
    !endDate ||
    !usageLimit
  ) {
    throw new AppError(
      "Please provide all required data (code,discountType,discountValue,startDate,endDate,usageLimit)",
      400
    );
  }
  if (
    discountType === DiscountType.PERCENTAGE &&
    (discountValue < 0 || discountValue > 100)
  ) {
    throw new AppError("Discount value must be between 0 and 100", 400);
  }

  if (discountType === DiscountType.FIXEDAMOUNT && discountValue <= 0) {
    throw new AppError("Discount value must be greater than 0", 400);
  }

  if (startDate > endDate) {
    throw new AppError("Start date must be before end date", 400);
  }

  if (usageLimit < 1) {
    throw new AppError("Usage limit must be at least 1", 400);
  }
  // validate if there  is anther discount code with  the same code

  const existingCode: IDiscountCode | null = await DiscountCode.findOne({
    code,
  });
  if (existingCode) {
    throw new AppError(
      "Code already exist please chose anther code and may you add part of your shop name within the code to ensure it unique",
      400
    );
  }
};

// validate allowed product is related to the website only
const validateAllowedProductsAndCategory = async (
  req: WebsiteDiscountCodeRequest
) => {
  const { allowedCategories, allowedProducts } = req.body;
  if (allowedProducts !== undefined) {
    // loop over the allowed products and check if they are valid and related to the shop
    // find all products one
    const products: IProduct[] = await Product.find({
      _id: { $in: allowedProducts },
    });
    if (products.length !== allowedProducts.length) {
      throw new AppError(
        "Invalid products in allowed products(its seems you provide none  correct data about the products please check again the products ids)",
        400
      );
    }
    // check if the products are related to the shop
    for (const product of products) {
      if (product.sourceType !== ProductSourceType.Website) {
        throw new AppError(
          "Invalid products in allowed products(its seems you provide none  correct data about the products please check again the products ids)",
          400
        );
      }
    }
  }
  // check if the categories are valid and exist on the Product category enum
  if (allowedCategories !== undefined) {
    for (const category of allowedCategories) {
      if (!Object.values(ProductCategory).includes(category)) {
        throw new AppError("Invalid category in allowed categories", 400);
      }
    }
  }
};

export const validateBeforeCreateDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    // validate the body data
    await validateBodyData(req);

    // validate the allowed products if it exist and related to the shop
    await validateAllowedProductsAndCategory(req);

    next();
  }
);
