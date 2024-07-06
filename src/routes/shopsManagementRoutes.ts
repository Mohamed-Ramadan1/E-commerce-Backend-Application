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
router.route("/:id").get(getShop).delete(deleteShop).patch(updateShop);

router.route("/:id/activate").patch(activateShop);
router.route("/:id/un-active").patch(unActiveShop);

router.route("/:id/products").get(getAllProductsInShop);
router.route("/:id/products/:productId").get(getSingleProductInShop);
router.route("/:id/products/:productId/freeze").patch(freezingProductInShop);
router
  .route("/:id/products/:productId/unfreeze")
  .patch(unfreezingProductInShop);

export default router;
