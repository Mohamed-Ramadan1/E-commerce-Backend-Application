import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  getShopAnalyticsReport,
  getAllShopAnalyticsReports,
  getAllReports,
  getReport,
  deleteReport,
} from "../../controllers/analytics/shopeAnalyticsReportController";

const router = Router();
router.use(protect);

router.route("/").get(restrictTo("admin"), getAllReports);
router.route("/my-shop/all").get(getAllShopAnalyticsReports);
router.route("/my-shop/:id").get(getShopAnalyticsReport);
router.use(restrictTo("admin"));
router.route("/:id").get(getReport).delete(deleteReport);

export default router;
