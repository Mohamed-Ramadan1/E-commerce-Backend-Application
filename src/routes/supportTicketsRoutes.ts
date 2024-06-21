import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getSupportTickets,
  getSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  openSupportTicket,
} from "../controllers/supportTickets";
const router = Router();
router.use(protect);

router.route("/").get(getSupportTickets).post(openSupportTicket);

router
  .route("/:id")
  .get(getSupportTicket)
  .patch(updateSupportTicket)
  .delete(deleteSupportTicket);
export default router;
