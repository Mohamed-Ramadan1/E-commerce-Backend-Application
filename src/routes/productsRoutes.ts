import { Router } from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";
const router = Router();

import { protect, restrictTo } from "../middlewares/authMiddleware";

router
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTo("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .patch(protect, restrictTo("admin"), updateProduct)
  .delete(protect, restrictTo("admin"), deleteProduct);
export default router;
