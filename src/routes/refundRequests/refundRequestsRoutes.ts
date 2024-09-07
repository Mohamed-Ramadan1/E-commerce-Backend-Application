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
} from "../../controllers/refundRequests/refundController";

import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

import { validateRefundRequest } from "../../middlewares/refundRequests/refundRequestsMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllRefundRequests).post(createRefundRequest);
router.route("/confirmed").get(getAllRefundRequestsConfirmed);
router.route("/notConfirmed").get(getAllRefundRequestsNotConfirmed);

router.route("/:id").get(getRefundRequest).delete(deleteRefundRequest);

router.route("/:id/confirm").patch(validateRefundRequest, confirmRefundRequest);
router.route("/:id/reject").patch(validateRefundRequest, rejectRefundRequest);

export default router;
