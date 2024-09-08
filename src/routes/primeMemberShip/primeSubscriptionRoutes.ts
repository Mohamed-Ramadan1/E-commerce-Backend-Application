import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth/authMiddleware";
import { validateBeforeCancelMySubscription } from "../../middlewares/primeSubscription/primeSubscriptionMiddleware";
import {
  createSubscription,
  getMyLatestPrimeSubscription,
  getAllPreviousSubscriptions,
  cancelMySubscription,
  renewMySubscription,
} from "../../controllers/primeMemberShip/primeSubscriptionController";
const router = Router();

router.use(protect);
router.route("/").get(getAllPreviousSubscriptions);
router
  .route("/cancel")
  .patch(validateBeforeCancelMySubscription, cancelMySubscription);

router.route("/renew").post(renewMySubscription);

router.route("/my-latest").get(getMyLatestPrimeSubscription);

export default router;
