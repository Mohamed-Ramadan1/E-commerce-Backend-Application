import { Schema, model, Model } from "mongoose";
import { INotification, NotificationType } from "./notification.interface";

const NotificationSchema: Schema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel: Model<INotification> = model<INotification>(
  "Notification",
  NotificationSchema
);

export default NotificationModel;
