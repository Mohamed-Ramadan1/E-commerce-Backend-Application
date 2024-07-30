import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getShopOrder,
  getShopOrders,
  deleteShopOrder,
} from "../controllers/shopOrdersController";
import { validateBeforeShopOrdersOperations } from "../middlewares/shopOrdersMiddleware";

const router = Router();

router.use(protect);
router.use(validateBeforeShopOrdersOperations);

router.route("/").get(getShopOrders);

router.route("/:id").get(getShopOrder).delete(deleteShopOrder);

export default router;
