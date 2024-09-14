import { Router } from "express";
import {
  checkoutWithCash,
  checkoutWithStripe,
} from "../../controllers/checkout/checkoutController";

import { protect } from "../../middlewares/auth/authMiddleware";
import { checkCartAvailability } from "../../middlewares/checkout/checkoutMiddleware";
const router = Router();
router.use(protect);

router.route("/cash").post(checkCartAvailability, checkoutWithCash);
router.route("/stripe").post(checkCartAvailability, checkoutWithStripe);

export default router;
