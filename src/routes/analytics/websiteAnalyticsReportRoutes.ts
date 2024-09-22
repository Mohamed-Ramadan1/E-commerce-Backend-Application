import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  getAllWebsiteAnalyticsReports,
  getWebsiteAnalyticsReport,
  deleteWebsiteAnalyticsReport,
} from "../../controllers/analytics/websiteAnalyticsReportController";

const router = Router();
router.use(protect, restrictTo("admin"));
router.route("/").get(getAllWebsiteAnalyticsReports);
router
  .route("/:id")
  .get(getWebsiteAnalyticsReport)
  .delete(deleteWebsiteAnalyticsReport);

export default router;
