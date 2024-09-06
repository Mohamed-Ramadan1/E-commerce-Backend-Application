import { Router } from "express";
import {
  getUserNotifications,
  createNotification,
  getUserNotification,
  deleteUserNotification,
  deleteAllUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markGroupAsRead,
  deleteGroupOfNotification,
  muteNotifications,
  unmuteNotifications,
} from "../../controllers/notifications/notificationController";

import { protect, restrictTo } from "../../middlewares/authMiddleware";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getUserNotifications)
  .post(restrictTo("admin"), createNotification)
  .patch(markAllNotificationsAsRead)
  .delete(deleteAllUserNotifications);

router.route("/group").patch(markGroupAsRead).delete(deleteGroupOfNotification);

router.patch("/mute", muteNotifications);
router.patch("/unmute", unmuteNotifications);

router
  .route("/:id")
  .get(getUserNotification)
  .patch(markNotificationAsRead)
  .delete(deleteUserNotification);

export default router;
