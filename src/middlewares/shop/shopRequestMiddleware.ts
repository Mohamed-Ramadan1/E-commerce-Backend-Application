//system imports
import { NextFunction, Response } from "express";

//models imports
import ShopRequest from "../../models/shop/shopRequestModal";
import Shop from "../../models/shop/shopModal";
import User from "../../models/user/userModel";

// interface imports
import { IShopRequest } from "../../models/shop/shopRequest.interface";
import { IUser } from "../../models/user/user.interface";
import { ShopRequestReq } from "../../requestsInterfaces/shop/shopRequests.interface";

// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";

export const validateRequestBeforeShopRequestCreation = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const { shopDescription } = req.body;
    const user = req.user;
    if (!shopDescription) {
      return next(
        new AppError("Please provide shop name and description", 400)
      );
    }

    // check if the user has verification his email or not
    if (!user.verified) {
      return next(
        new AppError(
          "You haven't verified your email. Please verify your email to proceed.",
          400
        )
      );
    }

    // check if the user create a request or not
    const existShopRequest = await ShopRequest.findOne({ user: user._id });
    if (existShopRequest) {
      return next(
        new AppError(
          `You have already requested to create a shop pleas wait until your request been processed , we will contact you soon as possible.`,
          400
        )
      );
    }
    // check if the user has already shop or not
    const existShop = await Shop.findOne({ owner: user._id });
    if (existShop) {
      return next(
        new AppError(
          "you already have a shop , you can't create a new shop. if you want to create a new shop please delete your current shop or create a new account.",
          400
        )
      );
    }

    next();
  }
);

export const validateShopRequestBeforeApprove = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const shopRequest: IShopRequest | null = await ShopRequest.findOne({
      _id: req.params.id,
    });

    if (!shopRequest) {
      return next(new AppError("No shop request found with this ID", 404));
    }
    if (shopRequest.requestStatus === "cancelled") {
      return next(
        new AppError(
          "This shop request is canceled and not be valid to be approved",
          400
        )
      );
    }
    if (shopRequest.requestStatus === "approved") {
      return next(new AppError("This shop request is already approved ", 400));
    }

    if (shopRequest.requestStatus === "rejected") {
      return next(
        new AppError(
          "This shop request is already rejected and not valid to be approved. ",
          400
        )
      );
    }
    // check if the user still exist on the system
    const user = await User.findOne({ _id: shopRequest.user });
    if (!user) {
      return next(
        new AppError(
          "the user who created this request is no more exist .",
          404
        )
      );
    }

    req.userToOpenShop = user;
    req.shopRequest = shopRequest;
    next();
  }
);

export const validateShopRequestBeforeReject = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    //reject the request and send reject email to the user
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return next(new AppError("Please provide a rejection reason", 400));
    }
    const shopRequest: IShopRequest | null = await ShopRequest.findById(
      req.params.id
    );

    if (!shopRequest) {
      return next(new AppError("Shop request not found", 404));
    }
    const userToOpenShop = (await User.findById(shopRequest.user)) as IUser;

    if (!userToOpenShop) {
      return next(
        new AppError("The user who created this request is no more exist", 404)
      );
    }

    if (shopRequest.requestStatus === "rejected") {
      return next(new AppError("Shop request is already rejected", 400));
    }
    req.shopRequest = shopRequest;
    req.userToOpenShop = userToOpenShop;
    next();
  }
);

export const validateShopRequestBeforeCancel = catchAsync(
  async (req: ShopRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const shopRequest: IShopRequest | null = await ShopRequest.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!shopRequest) {
      return next(new AppError("No shop request found with this id.", 404));
    }
    if (shopRequest.requestStatus === "cancelled") {
      return next(new AppError("Shop request is already cancelled", 400));
    }
    if (
      shopRequest.requestStatus === "approved" ||
      shopRequest.requestStatus === "rejected"
    ) {
      return next(
        new AppError(
          "Cannot cancel a shop request that is already approved or rejected",
          400
        )
      );
    }
    req.shopRequest = shopRequest;
    next();
  }
);
