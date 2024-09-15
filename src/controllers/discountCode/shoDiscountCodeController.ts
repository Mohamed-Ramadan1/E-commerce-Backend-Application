// system imports
import { Response, NextFunction } from "express";

// models imports
import DiscountCode from "../../models/discountCode/discountCodeModel";

// interface imports
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import { ShopDiscountCodeRequest } from "../../requestsInterfaces/discountCode/shopDiscountCodeRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import {
  DiscountCodeSource,
  IDiscountCode,
} from "../../models/discountCode/discountCode.interface";

// create shop discount code
export const createDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const { shop } = req;
    const discountCode: IDiscountCode = await DiscountCode.create({
      ...req.body,
      shop,
      discountCodeSource: DiscountCodeSource.SHOP,
    });
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(201, response, res);
  }
);

// get all discount codes on the shop
export const getDiscountCodes = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      DiscountCode.find({ shop: req.user.myShop }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const discountCodes: IDiscountCode[] = await features.execute();

    const response: ApiResponse<IDiscountCode[]> = {
      status: "success",
      results: discountCodes.length,
      data: discountCodes,
    };

    sendResponse(200, response, res);
  }
);

// get discount code by id and related to user shop
export const getDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      shop: req.user.myShop,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);

// update discount code by id and related to user shop
export const updateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null =
      await DiscountCode.findOneAndUpdate(
        {
          _id: req.params.id,
          shop: req.user.myShop,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }

    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);

// delete discount code by id and related to user shop
export const deleteDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null =
      await DiscountCode.findOneAndDelete({
        _id: req.params.id,
        shop: req.user.myShop,
      });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }

    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      message: "Discount code deleted successfully",
    };
    sendResponse(200, response, res);
  }
);

// activate discount code by id and related to user shop
export const activateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      shop: req.user.myShop,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }

    if (discountCode.isActive) {
      return next(new AppError("Discount code is already active", 400));
    }
    discountCode.isActive = true;
    await discountCode.save();
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);

// deactivate discount code by id and related to user shop
export const disActivateDiscountCode = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      shop: req.user.myShop,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }

    if (!discountCode.isActive) {
      return next(new AppError("Discount code is already inactive", 400));
    }
    discountCode.isActive = false;
    await discountCode.save();
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);

// update discount code end date by id and related to user shop
export const updateDiscountCodeEndDate = catchAsync(
  async (req: ShopDiscountCodeRequest, res: Response, next: NextFunction) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      shop: req.user.myShop,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to this shop",
          404
        )
      );
    }
    if (req.body.endDate < new Date()) {
      return next(new AppError("End date must be in the future", 400));
    }

    discountCode.endDate = req.body.endDate;
    await discountCode.save();
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(200, response, res);
  }
);
