// system imports
import { Response, NextFunction } from "express";

// models imports
import DiscountCode from "../../models/discountCode/discountCodeModel";

// interface imports
import { ApiResponse } from "../../requestsInterfaces/shared/response.interface";
import { WebsiteDiscountCodeRequest } from "../../requestsInterfaces/discountCode/websiteiscountCodeRequest.interface";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import {
  DiscountCodeSource,
  IDiscountCode,
} from "../../models/discountCode/discountCode.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import { sendResponse } from "../../utils/apiUtils/sendResponse";

export const createDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode = await DiscountCode.create({
      ...req.body,
      discountCodeSource: DiscountCodeSource.WEBSITE,
    });
    const response: ApiResponse<IDiscountCode> = {
      status: "success",
      data: discountCode,
    };
    sendResponse(201, response, res);
  }
);

// get all  discount codes related to website
export const getDiscountCodes = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const features = new APIFeatures(
      DiscountCode.find({ discountCodeSource: DiscountCodeSource.WEBSITE }),
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

// get discount code related to website
export const getDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      discountCodeSource: DiscountCodeSource.WEBSITE,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to the website",
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

// update discount code related to website
export const updateDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null =
      await DiscountCode.findOneAndUpdate(
        {
          _id: req.params.id,
          discountCodeSource: DiscountCodeSource.WEBSITE,
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
          "No discount code found with this id and related to the website",
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

// delete discount code related to website
export const deleteDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null =
      await DiscountCode.findOneAndDelete({
        _id: req.params.id,
        discountCodeSource: DiscountCodeSource.WEBSITE,
      });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to the website",
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
// activate discount code related to website
export const activateDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      discountCodeSource: DiscountCodeSource.WEBSITE,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to the website",
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

// un activate discount code related to website
export const disActivateDiscountCode = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      discountCodeSource: DiscountCodeSource.WEBSITE,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to the website",
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

// update discount code start date related to website
export const updateDiscountCodeEndDate = catchAsync(
  async (
    req: WebsiteDiscountCodeRequest,
    res: Response,
    next: NextFunction
  ) => {
    const discountCode: IDiscountCode | null = await DiscountCode.findOne({
      _id: req.params.id,
      discountCodeSource: DiscountCodeSource.WEBSITE,
    });
    if (!discountCode) {
      return next(
        new AppError(
          "No discount code found with this id and related to the  website",
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
