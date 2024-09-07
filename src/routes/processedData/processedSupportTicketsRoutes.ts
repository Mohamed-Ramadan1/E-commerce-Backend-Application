import { Router } from "express";
import {
  getProcessedSupportTicket,
  getProcessedSupportTickets,
  updateProcessedSupportTicket,
  deleteProcessedSupportTicket,
} from "../../controllers/processedData/processedSupportTicketsController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

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
