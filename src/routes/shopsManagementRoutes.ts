import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getAllShops,
  getShop,
  deleteShop,
  updateShop,
  unActiveShop,
  activateShop,
  getAllProductsInShop,
  getSingleProductInShop,
  freezingProductInShop,
  unfreezingProductInShop,
  getAllOrdersCreatedOnShop,
  getSingleOrderCreatedOnShop,
} from "../controllers/shopsManagementController";
const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllShops);
router.route("/:shopId").get(getShop).delete(deleteShop).patch(updateShop);

router.route("/:shopId/activate").patch(activateShop);
router.route("/:shopId/un-active").patch(unActiveShop);

router.route("/:shopId/products").get(getAllProductsInShop);
router.route("/:shopId/products/:productId").get(getSingleProductInShop);
router
  .route("/:shopId/products/:productId/freeze")
  .patch(freezingProductInShop);
router
  .route("/:shopId/products/:productId/unfreeze")
  .patch(unfreezingProductInShop);

router.route("/:shopId/orders").get(getAllOrdersCreatedOnShop);
router.route("/:shopId/orders/:orderId").get(getSingleOrderCreatedOnShop);

export default router;
