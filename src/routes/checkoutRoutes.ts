import { Router } from "express";
import { checkoutWithCash } from "../controllers/checkoutController";

import { protect } from "../middlewares/authMiddleware";
import { checkCartAvailability } from "../middlewares/checkoutMiddleware";
const router = Router();

router.route("/cash").post(protect, checkCartAvailability, checkoutWithCash);
// router
//   .route("/stripe")
//   .post(protect, checkCartAvailability, checkoutWithStripe);

export default router;
