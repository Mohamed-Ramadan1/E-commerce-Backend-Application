import { Router } from "express";
import {
  getOrder,
  getOrders,
  cancelOrder,
  archiveOrder,
  unarchiveOrder,
  getArchivedOrders,
} from "../controllers/orderController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);

router.route("/").get(getOrders);
router.route("/archived").get(getArchivedOrders);

router.route("/:id").get(getOrder);
router.route("/:id/cancel").patch(cancelOrder);
router.route("/:id/archive").patch(archiveOrder);
router.route("/:id/unarchive").patch(unarchiveOrder);
export default router;
