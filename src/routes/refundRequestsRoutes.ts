import { Router } from "express";
import {
  getAllRefundRequests,
  createRefundRequest,
  getAllRefundRequestsNotConfirmed,
  getRefundRequest,
  deleteRefundRequest,
  confirmRefundRequest,
  rejectRefundRequest,
  getAllRefundRequestsConfirmed,
} from "../controllers/refundController";

import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateBeforeConfirmRefundRequest } from "../middlewares/refundRequestsMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllRefundRequests).post(createRefundRequest);
router.route("/confirmed").get(getAllRefundRequestsConfirmed);
router.route("/notConfirmed").get(getAllRefundRequestsNotConfirmed);

router.route("/:id").get(getRefundRequest).delete(deleteRefundRequest);

router
  .route("/:id/confirm")
  .patch(validateBeforeConfirmRefundRequest, confirmRefundRequest);
router.route("/:id/reject").patch(rejectRefundRequest);

export default router;
