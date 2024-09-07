// system imports
import { NextFunction, Response } from "express";

// models imports
import Shop from "../../models/shop/shopModal";
import Product from "../../models/product/productModel";

// interfaces imports
import { IShop } from "../../models/shop/shop.interface";
import { IProduct } from "../../models/product/product.interface";
import { ShopProductsRequest } from "../../shared-interfaces/shopProductsRequest.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";

// emails imports

// Middleware for validation the new product dat before adding it to the shop and start sale it.
export const validateBeforeAddNewProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    const shop: IShop | null = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet open shop to be able to start add products.",
          404
        )
      );
    }
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is not active the un-actives shops can't add products.",
          404
        )
      );
    }

    const {
      name,
      description,
      category,
      brand,
      color,
      stock_quantity,
      price,
      discount,
      material,
      manufacturer,
      images,
    } = req.body;
    if (
      !name ||
      !description ||
      !category ||
      !brand ||
      !stock_quantity ||
      !price ||
      !material
    ) {
      return next(
        new AppError(
          "Missing required fields. name ,description,category,brand-name,stock_quantity,price are required please provide this data",
          400
        )
      );
    }
    const productInformation: Object = {
      sourceType: "shop",
      shopId: req.user.myShop,
      name,
      description,
      category,
      brand,
      color,
      stock_quantity,
      price,
      discount,
      material,
      manufacturer,
      images,
    };
    req.productInformation = productInformation;
    req.shop = shop;
    next();
  }
);

// Middleware for validation the product data before updating it.
export const validateBeforeUpdateProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    /* 
    not allowed to update
    sourceType, shopId, availability_status,return policy totalReviews, averageRating,
    */
    if (
      req.body.sourceType ||
      req.body.shopId ||
      req.body.availability_status ||
      req.body.return_policy ||
      req.body.totalReviews ||
      req.body.averageRating
    ) {
      return next(
        new AppError(
          "You can't update the product sourceType, shopId, availability_status, return policy, totalReviews, averageRating fields.",
          400
        )
      );
    }
    // validate if the current shop exists and the product related to the product
    const shop: IShop | null = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet open shop to be able to update products.",
          404
        )
      );
    }

    // validate if the shop is already active (not active shoppes not allowed to update products information).
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is not active the un-actives shops can't update products.",
          404
        )
      );
    }
    // get the product by the givin parameter id.
    const product: IProduct | null = await Product.findById(
      req.params.productId
    );
    // check if the product is already exist.
    if (!product) {
      return next(new AppError("Product not found with the given id.", 404));
    }
    // check if the product is related to the current shop.
    if (!product.shopId) {
      return next(new AppError("Product not related to the shop.", 404));
    }

    // check if the user is authorized to update the product (user is the shop owner).
    if (product.shopId.toString() !== req.user.myShop!.toString()) {
      return next(
        new AppError("You are not authorized to update this product.", 403)
      );
    }
    req.product = product;
    req.shop = shop;
    next();
  }
);

// Middleware for validation the product data before deleting it.
export const validateBeforeDeleteProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    /* 
    validation 
    product existing , 
    shop existing , 
    product is already owned by this shop
    */
    if (!req.params.productId) {
      return next(new AppError("Product id is required.", 400));
    }
    const shop: IShop | null = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet open shop to be able to delete products.",
          404
        )
      );
    }
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is not active the un-actives shops can't delete products.",
          404
        )
      );
    }
    const product: IProduct | null = await Product.findById(
      req.params.productId
    );
    if (!product) {
      return next(new AppError("Product not found with the given id.", 404));
    }
    if (!product.shopId) {
      return next(new AppError("Product not related to the shop.", 404));
    }
    if (product.shopId.toString() !== req.user.myShop!.toString()) {
      return next(
        new AppError("You are not authorized to delete this product.", 403)
      );
    }
    req.product = product;
    req.shop = shop;
    next();
  }
);

// Middleware for validation the product data before freezing it.
export const validateBeforeFreezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    /* 
    validation 
    product existing , 
    shop existing , 
    product is already owned by this shop
    */
    if (!req.params.productId) {
      return next(new AppError("Product id is required.", 400));
    }
    const shop: IShop | null = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet open shop to be able to freeze products.",
          404
        )
      );
    }
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is not active the un-actives shops can't freeze products.",
          404
        )
      );
    }
    const product: IProduct | null = await Product.findById(
      req.params.productId
    );
    if (!product) {
      return next(new AppError("Product not found with the given id.", 404));
    }

    if (!product.shopId) {
      return next(new AppError("Product not related to the shop.", 404));
    }
    if (product.shopId.toString() !== req.user.myShop!.toString()) {
      return next(
        new AppError("You are not authorized to freeze this product.", 403)
      );
    }
    if (product.freezed === true) {
      return next(new AppError("This product is already frozen.", 400));
    }
    req.product = product;
    req.shop = shop;
    next();
  }
);
// Middleware for validation the product data before unfreezing it.
export const validateBeforeUnFreezeProduct = catchAsync(
  async (req: ShopProductsRequest, res: Response, next: NextFunction) => {
    /* 
    validation 
    product existing , 
    shop existing , 
    product is already owned by this shop
    */
    if (!req.params.productId) {
      return next(new AppError("Product id is required.", 400));
    }
    const shop: IShop | null = await Shop.findById(req.user.myShop);
    if (!shop) {
      return next(
        new AppError(
          "You don't have shop yet open shop to be able to unfreeze products.",
          404
        )
      );
    }
    if (shop.isActive === false) {
      return next(
        new AppError(
          "Your shop is not active the un-actives shops can't unfreeze products.",
          404
        )
      );
    }
    const product: IProduct | null = await Product.findById(
      req.params.productId
    );
    if (!product) {
      return next(new AppError("Product not found with the given id.", 404));
    }
    if (!product.shopId) {
      return next(new AppError("Product not related to the shop.", 404));
    }
    if (product.shopId.toString() !== req.user.myShop!.toString()) {
      return next(
        new AppError("You are not authorized to unfreeze this product.", 403)
      );
    }
    if (product.freezed === false) {
      return next(new AppError("This product is already unfrozen.", 400));
    }
    req.product = product;
    req.shop = shop;
    next();
  }
);
