import { Router } from "express";
import {
  getOrder,
  getOrders,
  cancelOrder,
} from "../controllers/orderController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.route("/").get(getOrders);

router.route("/:id").get(getOrder);
router.route("/:id/cancel").patch(cancelOrder);
export default router;
