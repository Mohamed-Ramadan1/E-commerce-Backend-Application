// system imports
import { NextFunction, Response } from "express";

// models imports
import Shop from "../../models/shop/shopModal";
import Product from "../../models/product/productModel";
// interfaces imports
import { IShop } from "../../models/shop/shop.interface";
import { IProduct } from "../../models/product/product.interface";
import { ShopProductsRequest } from "../../requestsInterfaces/shop/shopProductsRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
// emails imports
import addProductConfirmationEmail from "../../emails/shops-products/addProductConfirmationEmail";
import productUpdateConfirmationEmail from "../../emails/shops-products/updateProductConfirmationEmail";
import productDeletionConfirmationEmail from "../../emails/shops-products/deleteProductConfirmationEmail";
import productFreezeConfirmationEmail from "../../emails/shops-products/freezingProductConfirmationEmail";
import productUnfreezeConfirmationEmail from "../../emails/shops-products/unfreezingProductConfirmationEmail";

// get all products on shop
export const getAllProducts = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const shop = (await Shop.findById(req.params.shopId)) as IShop;

    const features = new APIFeatures(
      Product.find({ shopId: shop.id }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products: IProduct[] = await features.execute();

    const json: ApiResponse<IProduct[]> = {
      status: "success",
      results: products.length,
      data: products,
    };
    sendResponse(200, json, res);
  }
);

// add product to the shop
export const addProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const product: IProduct = await Product.create(req.productInformation);
    if (!product) {
      return next(
        new AppError("something went wrong while creating the new product", 500)
      );
    }
    // send product add confirmation email
    addProductConfirmationEmail(req.user, req.shop, product);

    const json: ApiResponse<IProduct> = {
      status: "success",
      data: product,
    };
    sendResponse(201, json, res);
  }
);

// update product confirmation email
export const updateProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    /* 
    all  validation is done on the middleware stage 
    the user is allowed to update the product data (note blocked ones.)
    */
    //update the product after filtering the body and insure the body not contain none required fildes.
    await Product.updateOne(
      {
        _id: product._id,
      },
      req.body
    );

    // send confirmation email
    productUpdateConfirmationEmail(req.user, shop, product);
    // create response json object
    const response: ApiResponse<null> = {
      status: "success",
      message: "Product updated successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// delete existing product
export const deleteProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // delete the product from the shop
    await Product.deleteOne({
      _id: product._id,
    });
    // send product delete confirmation email
    productDeletionConfirmationEmail(req.user, req.shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product deleted successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// freeze product in the shop
export const freezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // set the product as freezed
    await Product.updateOne(
      {
        _id: product._id,
      },
      {
        freezed: true,
      }
    );
    // send product freeze confirmation email
    productFreezeConfirmationEmail(req.user, shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product has been frozen successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);

// un-freeze product in the shop
export const unfreezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const { product, shop } = req;
    // set the product as un-freezed
    await Product.updateOne(
      {
        _id: product._id,
      },
      {
        freezed: false,
      }
    );
    // send product unfreeze confirmation email
    productUnfreezeConfirmationEmail(req.user, shop, product);

    const response: ApiResponse<null> = {
      status: "success",
      message: "Product has been unfrozen successfully",
    };

    // send response to the user
    sendResponse(200, response, res);
  }
);
