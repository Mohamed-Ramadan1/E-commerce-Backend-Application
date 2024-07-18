import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getSupportTickets,
  getSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  openSupportTicket,
  createSupportTicket,
  supportTicketResponse,
} from "../controllers/supportTickets";
const router = Router();
router.use(protect);

router.route("/me/open-ticket").post(openSupportTicket);

// admin routes
router.use(restrictTo("admin"));
router.route("/").get(getSupportTickets).post(createSupportTicket);

router
  .route("/:id")
  .get(getSupportTicket)
  .patch(updateSupportTicket)
  .delete(deleteSupportTicket);

router.route("/:id/ticket-response").patch(supportTicketResponse);
export default router;
