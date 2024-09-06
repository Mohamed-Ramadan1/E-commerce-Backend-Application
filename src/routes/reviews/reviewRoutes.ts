import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/authMiddleware";
import { validateDataBeforeCreateReview } from "../../middlewares/reviewMiddleware";
import {
  getReviews,
  getReview,
  addReview,
  deleteReview,
  updateReview,
  getProductReviews,
} from "../../controllers/reviews/reviewController";
const router = Router();
router.use(protect);

router
  .route("/")
  .get(getReviews)
  .post(validateDataBeforeCreateReview, addReview);

router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);
router.route("/product/:productId").get(getProductReviews);

export default router;
