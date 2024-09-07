import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  getSubOrder,
  getSubOrders,
  deleteSubOrder,
  getAllOrders,
  getOrder,
  deleteOrder,
} from "../../controllers/orders/subOrdersController";
import { validateBeforeShopOrdersOperations } from "../../middlewares/order/subOrdersMiddleware";

const router = Router();

router.use(protect);

router
  .route("/my-shop/all")
  .get(validateBeforeShopOrdersOperations, getSubOrders);
router
  .route("/my-shop/:orderId")
  .get(validateBeforeShopOrdersOperations, getSubOrder)
  .delete(validateBeforeShopOrdersOperations, deleteSubOrder);

router.use(restrictTo("admin"));
router.route("/").get(getAllOrders);
router.route("/:id").get(getOrder).delete(deleteOrder);
export default router;
