import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  getAllPrimeSubscriptions,
  getPrimeSubscriptionById,
  updatePrimeSubscription,
  deletePrimeSubscription,
  createPrimeSubscription,
  cancelPrimeSubscription,
  renewPrimeSubscription,
} from "../controllers/adminPrimeSubscriptionController";
import {
  validateBeforeCreatePrimeSubscription,
  validateBeforeCancelPrimeSubscription,
} from "../middlewares/adminPrimeSubscriptionMiddleware";
const router = Router();

router.use(protect, restrictTo("admin"));

router
  .route("/")
  .get(getAllPrimeSubscriptions)
  .post(validateBeforeCreatePrimeSubscription, createPrimeSubscription);

router
  .route("/cancel")
  .patch(validateBeforeCancelPrimeSubscription, cancelPrimeSubscription);
router.route("/renew").patch(renewPrimeSubscription);

router
  .route("/:id")
  .get(getPrimeSubscriptionById)
  .patch(updatePrimeSubscription)
  .delete(deletePrimeSubscription);
export default router;
