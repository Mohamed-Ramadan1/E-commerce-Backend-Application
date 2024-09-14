import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
} from "../../controllers/messages/messageController";
import { validateBeforeCreateMessage } from "../../middlewares/messages/messagesMiddleware";

const router = Router();
router.use(protect, restrictTo("admin"));

router
  .route("/")
  .get(getMessages)
  .post(validateBeforeCreateMessage, createMessage);
router.route("/:id").get(getMessage).patch(updateMessage).delete(deleteMessage);

export default router;
