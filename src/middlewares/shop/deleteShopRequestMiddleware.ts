// system imports
import { Request, Response, NextFunction } from "express";

// models imports
import DeleteShopRequest from "../../models/deleteShopRequest/deleteShopRequestModal";
import Shop from "../../models/shop/shopModal";
import User from "../../models/user/userModel";

// interface imports
import { IUser } from "../../models/user/user.interface";
import { IDeleteShopRequest } from "../../models/deleteShopRequest/deleteShopRequest.interface";
import { DeleteShopRequestReq } from "../../RequestsInterfaces/deleteShopRequestReq.interface";

// utils imports
import AppError from "../../utils/apiUtils/ApplicationError";
import catchAsync from "../../utils/apiUtils/catchAsync";

export const validateBeforeApproveDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deleteShopRequest: IDeleteShopRequest | null =
      await DeleteShopRequest.findById(id);

    if (!deleteShopRequest) {
      return next(
        new AppError("No delete shop request found with this id", 404)
      );
    }

    if (deleteShopRequest.requestStatus !== "pending") {
      return next(
        new AppError("Delete shop request is already processed", 400)
      );
    }

    req.shopOwner = deleteShopRequest.user as any;
    req.shop = deleteShopRequest.shop as any;
    req.deleteShopRequest = deleteShopRequest;

    next();
  }
);

// This related to admin route
export const validateBeforeCreateDeleteShopRequest = catchAsync(
  async (req: DeleteShopRequestReq, res: Response, next: NextFunction) => {
    const { shopId, reason, userId } = req.body;

    if (!shopId || !reason || !userId) {
      return next(
        new AppError(
          "Please provide shop id ,user id and  reason for deleting shop",
          400
        )
      );
    }

    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new AppError("No shop found with this id", 404));
    }
    const existingDeleteShopRequest = await DeleteShopRequest.findOne({
      shop: shopId,
      requestStatus: "pending",
    });

    if (existingDeleteShopRequest) {
      return next(
        new AppError(
          "Delete shop request for this shop already created please wait until your request processed.",
          400
        )
      );
    }

    const shopeOwner: IUser | null = await User.findById(shop.owner);

    if (!shopeOwner) {
      return next(new AppError("the shop owner is no longer exist", 404));
    }

    if ((shopeOwner?._id).toString() !== userId) {
      return next(
        new AppError(
          "Provided user id is not the owner of the shop you want to delete, please provide the correct user id",
          403
        )
      );
    }

    next();
  }
);
