import { Router } from "express";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";
import {
  createReport,
  getAllReports,
  getReport,
  updateReport,
  deleteReport,
  resolveReport,
} from "../../controllers/reportShops/reportShopController";
import {
  validateBeforeResolveReport,
  validateBeforeCreateReport,
} from "../../middlewares/reportShops/reportShopMiddleware";
const router = Router();
router.use(protect);

router
  .route("/")
  .post(validateBeforeCreateReport, createReport)
  .get(restrictTo("admin"), getAllReports);

router.use(restrictTo("admin"));
router.route("/:id").get(getReport).patch(updateReport).delete(deleteReport);
router
  .route("/:id/resolve")
  .patch(restrictTo("admin"), validateBeforeResolveReport, resolveReport);

export default router;
