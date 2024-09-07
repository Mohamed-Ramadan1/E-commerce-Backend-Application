// system imports
import { Response, NextFunction } from "express";

// Models imports
import Notification from "../../models/notification/notificationModal";

// interfaces imports
import { INotification } from "../../models/notification/notification.interface";
import { NotificationRequest } from "../../shared-interfaces/notificationRequest.interface";
// utils imports
import catchAsync from "../../utils/apiUtils/catchAsync";
import AppError from "../../utils/apiUtils/ApplicationError";
import APIFeatures from "../../utils/apiUtils/apiKeyFeature";
import { sendResponse } from "../../utils/apiUtils/sendResponse";
import { ApiResponse } from "../../shared-interfaces/response.interface";

import { getIO } from "../../utils/socket/socketSetup";

//---------------------------------
// admin operations

// create notification
export const createNotification = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { message, type, userId } = req.body;

    if (!message || !type) {
      return next(new AppError("Invalid notification data.", 400));
    }

    const newNotification = await Notification.create({
      user: userId,
      message,
      type,
    });

    const io = getIO();

    io.to(userId.toString()).emit("notification", {
      type: "NEW_NOTIFICATION",
      payload: newNotification,
    });

    const response: ApiResponse<INotification> = {
      status: "success",
      data: newNotification,
    };

    sendResponse(201, response, res);
  }
);

//-------------------------------------
// Users Operations

// get all notifications for a user
export const getUserNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Notification.find({ user: req.user._id }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const notifications = await features.execute();

    const response: ApiResponse<INotification[]> = {
      status: "success",
      results: notifications.length,
      data: notifications,
    };

    sendResponse(200, response, res);
  }
);

// get single notification for a user
export const getUserNotification = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      user: user._id,
    });

    if (!notification) {
      return next(new AppError("Notification with this id  not found", 404));
    }

    const response: ApiResponse<INotification> = {
      status: "success",
      data: notification,
    };

    sendResponse(200, response, res);
  }
);

// mark notification as read
export const markNotificationAsRead = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: user._id },
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return next(new AppError("Notification with this id  not found", 404));
    }

    const response: ApiResponse<INotification> = {
      status: "success",
      data: notification,
    };

    sendResponse(200, response, res);
  }
);

// mark all notifications as read
export const markAllNotificationsAsRead = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;

    await Notification.updateMany(
      { user: user._id },
      { read: true, readAt: new Date() }
    );

    const response: ApiResponse<string> = {
      status: "success",
      data: "All notifications marked as read",
    };

    sendResponse(200, response, res);
  }
);

// delete notification
export const deleteUserNotification = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: user._id,
    });

    if (!notification) {
      return next(new AppError("Notification with this id  not found", 404));
    }

    const response: ApiResponse<INotification> = {
      status: "success",
      data: notification,
    };

    sendResponse(204, response, res);
  }
);

// delete all notifications for a user
export const deleteAllUserNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;

    await Notification.deleteMany({ user: user._id });

    const response: ApiResponse<string> = {
      status: "success",
      data: "All notifications deleted",
    };

    sendResponse(204, response, res);
  }
);

//Mark groupe of notifications as read
export const markGroupAsRead = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { groupOfNotificationIds } = req.body;

    if (!groupOfNotificationIds || groupOfNotificationIds.length === 0) {
      return next(new AppError("No notification IDs provided", 400));
    }
    const updatedNotifications = await Notification.updateMany(
      {
        _id: { $in: groupOfNotificationIds },
        user: req.user._id,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      },
      { new: true }
    );

    if (updatedNotifications.modifiedCount === 0) {
      return next(
        new AppError(
          "No unread notifications found with these IDs for the current user",
          404
        )
      );
    }

    const response: ApiResponse<{ modifiedCount: number }> = {
      status: "success",
      data: { modifiedCount: updatedNotifications.modifiedCount },
    };

    sendResponse(200, response, res);
  }
);

//delete group notifications for a user
export const deleteGroupOfNotification = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { groupOfNotificationIds } = req.body;

    if (!groupOfNotificationIds || groupOfNotificationIds.length === 0) {
      return next(new AppError("No notification IDs provided", 400));
    }

    const deletedNotifications = await Notification.deleteMany({
      _id: { $in: groupOfNotificationIds },
      user: req.user._id,
    });

    if (deletedNotifications.deletedCount === 0) {
      return next(
        new AppError(
          "No unread notifications found with these IDs for the current user",
          404
        )
      );
    }

    const response: ApiResponse<{ deletedCount: number }> = {
      status: "success",
      data: { deletedCount: deletedNotifications.deletedCount },
    };

    sendResponse(200, response, res);
  }
);

// mute notification for a user
export const muteNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    if (user.isNotificationMuted) {
      return next(new AppError("Notifications are already muted", 400));
    }
    user.isNotificationMuted = true;
    await user.save({ validateBeforeSave: false });

    const response: ApiResponse<string> = {
      status: "success",
      data: "Notifications muted successfully",
    };

    sendResponse(200, response, res);
  }
);

//unmute notification for a user
export const unmuteNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user.isNotificationMuted) {
      return next(new AppError("Notifications are already unmuted", 400));
    }
    user.isNotificationMuted = false;
    await user.save({ validateBeforeSave: false });

    const response: ApiResponse<string> = {
      status: "success",
      data: "Notifications unmuted successfully",
    };

    sendResponse(200, response, res);
  }
);
