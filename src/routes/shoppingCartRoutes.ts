import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
const router = Router();
router.use(protect);
router.use(restrictTo("admin"));

// GET /v1/users/{userId}/shopping-cart/items
// POST /v1/users/{userId}/shopping-cart/items
// GET /v1/users/{userId}/shopping-cart/items/{itemId}
// PUT /v1/users/{userId}/shopping-cart/items/{itemId}
// DELETE /v1/users/{userId}/shopping-cart/items/{itemId}


export default router;
