import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  getSupportTickets,
  getSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  createSupportTicket,
  supportTicketResponse,
  openSupportTicket,
  getMySupportTickets,
  getMySupportTicket,
  updateMySupportTicket,
  deleteMySupportTicket,
} from "../../controllers/supportTickets/supportTickets";
const router = Router();
router.use(protect);

router.route("/me").get(getMySupportTickets);
router.route("/me/open-ticket").post(openSupportTicket);
router
  .route("/me/:id")
  .get(getMySupportTicket)
  .patch(updateMySupportTicket)
  .delete(deleteMySupportTicket);

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
