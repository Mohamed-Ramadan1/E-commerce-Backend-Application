import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getShopOrder,
  getShopOrders,
  deleteShopOrder,
  getAllOrders,
  getOrder,
  deleteOrder,
} from "../controllers/shopOrdersController";
import { validateBeforeShopOrdersOperations } from "../middlewares/shopOrdersMiddleware";

const router = Router();

router.use(protect);

router.use();
router
  .route("/my-shop/all")
  .get(validateBeforeShopOrdersOperations, getShopOrders);
router
  .route("/my-shop/:orderId")
  .get(validateBeforeShopOrdersOperations, getShopOrder)
  .delete(validateBeforeShopOrdersOperations, deleteShopOrder);

router.use(restrictTo("admin"));
router.route("/").get(getAllOrders);
router.route("/:id").get(getOrder).delete(deleteOrder);
export default router;
