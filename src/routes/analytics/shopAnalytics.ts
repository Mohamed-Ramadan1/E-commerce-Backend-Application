import { Router } from "express";

import { protect } from "../../middlewares/auth/authMiddleware";

import { getShopAnalytics } from "../../controllers/analytics/shopAnalytics";

const router = Router();
router.use(protect);

router.route("/:shopId").get(getShopAnalytics);

export default router;
