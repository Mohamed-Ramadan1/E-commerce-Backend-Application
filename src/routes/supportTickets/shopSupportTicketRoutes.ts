import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/authMiddleware";
import { upload } from "../../middlewares/multerMiddleware";
import {
  getMyShopSupportTicket,
  getMyShopSupportTickets,
  openShopSupportTicket,
  updateMyShopSupportTicket,
  deleteMyShopSupportTicket,
  createShopSupportTicket,
  getShopSupportTickets,
  getShopSupportTicket,
  updateShopSupportTicket,
  deleteShopSupportTicket,
  processSupportTicket,
} from "../../controllers/supportTickets/shopSupportTicketsController";

//middlewares
import {
  validateBeforeCreateShopSupportTicket,
  validateBeforeOpenShopSupportTicket,
  validateBeforeProcessShopSupportTicket,
} from "../../middlewares/shopSupportTicketMiddleware";

const router = Router();
router.use(protect);
// Shop Support Tickets Routes
// Open Shop Support Ticket
router
  .route("/myShop/open-ticket")
  .post(
    upload.single("img"),
    validateBeforeOpenShopSupportTicket,
    openShopSupportTicket
  );
// Get My Shop Support Tickets
router.route("/myShop/tickets").get(getMyShopSupportTickets);
// Get My Shop Support Ticket / update / delete
router
  .route("/myShop/tickets/:ticketId")
  .get(getMyShopSupportTicket)
  .patch(upload.single("img"), updateMyShopSupportTicket)
  .delete(deleteMyShopSupportTicket);

// Admin Support Tickets Routes
router.use(restrictTo("admin"));
// Create Shop Support Ticket / get al
router
  .route("/")
  .post(
    upload.single("img"),
    validateBeforeCreateShopSupportTicket,
    createShopSupportTicket
  )
  .get(getShopSupportTickets);
// Get Shop Support Ticket / update / delete
router
  .route("/:ticketId")
  .get(getShopSupportTicket)
  .patch(upload.single("img"), updateShopSupportTicket)
  .delete(deleteShopSupportTicket);

// Process Support Ticket
router
  .route("/:ticketId/process")
  .patch(validateBeforeProcessShopSupportTicket, processSupportTicket);

export default router;
