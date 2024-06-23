import { Router } from "express";
import {
  getOrder,
  getOrders,
  updateOrderStatusToDelivered,
  updateOrderStatusToShipped,
} from "../controllers/adminOrdersController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/all").get(getOrders);

router.route("/:id").get(getOrder);
router.route("/:id/delivered").patch(updateOrderStatusToDelivered);
router.route("/:id/shipped").patch(updateOrderStatusToShipped);

export default router;
