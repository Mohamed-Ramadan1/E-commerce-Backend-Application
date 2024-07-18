import { Router } from "express";
import {
  getProcessedSupportTicket,
  getProcessedSupportTickets,
  updateProcessedSupportTicket,
  deleteProcessedSupportTicket,
} from "../controllers/processedSupportTicketsController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getProcessedSupportTickets);

router
  .route("/:id")
  .get(getProcessedSupportTicket)
  .patch(updateProcessedSupportTicket)
  .delete(deleteProcessedSupportTicket);

export default router;
