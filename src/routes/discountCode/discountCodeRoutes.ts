import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import {
  checkDiscountCodeValidate,
  applyDiscountCode,
  unApplyDiscountCode,
  getDiscountCodeInformation,
} from "../../controllers/discountCode/discountCodeController";

import {
  validateBeforeApplyDiscountCode,
  validateBeforeUnApplyDiscountCode,
} from "../../middlewares/discountCode/discountCodeMiddleware";
const router = Router();
router.use(protect);
router.route("/apply").post(validateBeforeApplyDiscountCode, applyDiscountCode);
router
  .route("/unApply")
  .patch(validateBeforeUnApplyDiscountCode, unApplyDiscountCode);
router.route("/details").get(getDiscountCodeInformation);
router.route("/check-validity").get(checkDiscountCodeValidate);

export default router;
