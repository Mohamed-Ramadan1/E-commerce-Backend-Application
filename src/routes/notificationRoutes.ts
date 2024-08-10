import { Router } from "express";
import {
  getUserNotifications,
  createNotification,
  getUserNotification,
  deleteUserNotification,
  deleteAllUserNotifications,
  getUserReadNotifications,
  getUserUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController";

import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();
router.use(protect);
router
  .route("/")
  .get(getUserNotifications)
  .post(restrictTo("admin"), createNotification);

router.get("/unread", getUserUnreadNotifications);
router.get("/read", getUserReadNotifications);
router.delete("/delete-all", deleteAllUserNotifications);

router.route("/:id").get(getUserNotification).delete(deleteUserNotification);
router.patch("/mark-as-read/:id", markNotificationAsRead);
router.patch("/mark-all-as-read", markAllNotificationsAsRead);

export default router;
