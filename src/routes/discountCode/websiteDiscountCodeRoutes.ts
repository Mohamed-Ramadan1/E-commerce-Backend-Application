import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  getDiscountCode,
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  deleteDiscountCode,
  activateDiscountCode,
  disActivateDiscountCode,
  updateDiscountCodeEndDate,
} from "../../controllers/discountCode/websiteDiscountCodesController";
import { validateBeforeCreateDiscountCode } from "../../middlewares/discontCode/websiteDiscountCodeMiddleware";
const router = Router();
router.use(protect);

router
  .route("/")
  .get(getDiscountCodes)
  .post(validateBeforeCreateDiscountCode, createDiscountCode);

router.patch("/:id/activate", activateDiscountCode);
router.patch("/:id/unActive", disActivateDiscountCode);
router.patch("/:id/updateEndDate", updateDiscountCodeEndDate);

router
  .route("/:id")
  .get(getDiscountCode)
  .patch(updateDiscountCode)
  .delete(deleteDiscountCode);

export default router;
