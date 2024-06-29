import { Router } from "express";
import {
  createRefundRequest,
  getAllRefundRequestsNotConfirmed,
  getRefundRequestNotConfirmed,
  deleteRefundRequest,
  confirmRefundRequest,
  rejectRefundRequest,
  getAllRefundRequestsConfirmed,
  getRefundRequestConfirmed,
} from "../controllers/refundController";

import { protect, restrictTo } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));


export default router;
