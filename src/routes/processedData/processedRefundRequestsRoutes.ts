import { Router } from "express";
import {
  getProcessedRefundRequest,
  getProcessedRefundRequests,
  updateProcessedRefundRequest,
  deleteProcessedRefundRequest,
} from "../../controllers/processedData/processedRefundRequestsController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

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
