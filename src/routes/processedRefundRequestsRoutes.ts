import { Router } from "express";
import {
  getProcessedRefundRequest,
  getProcessedRefundRequests,
  updateProcessedRefundRequest,
  deleteProcessedRefundRequest,
} from "../controllers/processedRefundRequestsController";
import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getProcessedRefundRequests);

router
  .route("/:id")
  .get(getProcessedRefundRequest)
  .patch(updateProcessedRefundRequest)
  .delete(deleteProcessedRefundRequest);

export default router;
