import { Router } from "express";
import {
  checkoutWithCash,
  checkoutWithStripe,
} from "../../controllers/checkout/checkoutController";

import { protect } from "../../middlewares/auth/authMiddleware";
import { checkCartAvailability } from "../../middlewares/checkout/checkoutMiddleware";
const router = Router();

router.route("/cash").post(protect, checkCartAvailability, checkoutWithCash);
router
  .route("/stripe")
  .post(protect, checkCartAvailability, checkoutWithStripe);

export default router;
