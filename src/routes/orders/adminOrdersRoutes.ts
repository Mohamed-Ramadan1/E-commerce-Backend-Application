import { Router } from "express";
import {
  getOrder,
  getOrders,
  delverOrder,
  updateOrderStatusToShipped,
  cancelOrder,
} from "../../controllers/orders/adminOrdersController";
import {
  validateBeforeCancelOrder,
  validateBeforeUpdateShippingStatus,
  validateBeforeDeliverOrder,
} from "../../middlewares/ordersMiddleware";
import { protect, restrictTo } from "../../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/all").get(getOrders);

router.route("/:id").get(getOrder);
router.route("/:id/delivered").patch(validateBeforeDeliverOrder, delverOrder);
router
  .route("/:id/shipped")
  .patch(validateBeforeUpdateShippingStatus, updateOrderStatusToShipped);
router.route("/:id/cancel").patch(validateBeforeCancelOrder, cancelOrder);

export default router;
