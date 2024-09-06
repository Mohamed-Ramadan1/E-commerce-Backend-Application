import { Router } from "express";
import {
  getOrder,
  getOrders,
  cancelOrder,
  archiveOrder,
  unarchiveOrder,
  getArchivedOrders,
} from "../../controllers/orders/orderController";
import { protect, restrictTo } from "../../middlewares/authMiddleware";
import { validateBeforeCancelOrder } from "../../middlewares/ordersMiddleware";

const router = Router();

router.use(protect);
// router.use(restrictTo("user"));

router.route("/").get(getOrders);
router.route("/archived").get(getArchivedOrders);

router.route("/:id").get(getOrder);
router.route("/:id/cancel").patch(validateBeforeCancelOrder, cancelOrder);
router.route("/:id/archive").patch(archiveOrder);
router.route("/:id/unarchive").patch(unarchiveOrder);
export default router;
