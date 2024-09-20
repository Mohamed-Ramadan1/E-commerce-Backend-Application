import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";

import { getWebsiteAnalytics } from "../../controllers/analytics/websiteAnalytics";

const router = Router();
router.use(protect, restrictTo("admin"));

router.route("/").get(getWebsiteAnalytics);

export default router;
