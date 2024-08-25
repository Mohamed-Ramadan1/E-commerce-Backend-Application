// system imports
import { Response, NextFunction } from "express";

// Models imports
import Notification from "../models/notificationModal";

// interfaces imports
import { INotification } from "../models/notification.interface";
import { NotificationRequest } from "../shared-interfaces/notificationRequest.interface";
// utils imports
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/ApplicationError";
import APIFeatures from "../utils/apiKeyFeature";
import { sendResponse } from "../utils/sendResponse";
import { ApiResponse } from "../shared-interfaces/response.interface";

import { getIO } from "../utils/socketSetup";

//TODO mark group notifications as read

//TODO delete group notifications for a user

//TODO mute notification for a user

//TODO unmute notification for a user

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

// get unread notifications for a user
export const getUserUnreadNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Notification.find({
        user: req.user._id,
        read: false,
      }),
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

// get read notifications for a user
export const getUserReadNotifications = catchAsync(
  async (req: NotificationRequest, res: Response, next: NextFunction) => {
    const features = new APIFeatures(
      Notification.find({
        user: req.user._id,
        read: true,
      }),
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
