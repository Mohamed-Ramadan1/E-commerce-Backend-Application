import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  validateRequestBeforeShopRequestCreation,
  validateShopRequestBeforeApprove,
  validateShopRequestBeforeReject,
  validateShopRequestBeforeCancel,
} from "../middlewares/shopRequestMiddleware";

import {
  createShopRequest,
  cancelShopRequest,
  getAllShopRequests,
  getShopRequest,
  updateShopRequest,
  deleteShopRequest,
  confirmShopRequest,
  rejectShopRequest,
} from "../controllers/shopRequestController";
const router = Router();

router.use(protect);

// user operations
router
  .route("/:id/cancel")
  .patch(validateShopRequestBeforeCancel, cancelShopRequest);

router

  .route("/")
  .get(getAllShopRequests)
  .post(validateRequestBeforeShopRequestCreation, createShopRequest);

router.use(restrictTo("admin"));

router
  .route("/:id")
  .get(getShopRequest)
  .patch(updateShopRequest)
  .delete(deleteShopRequest);

router
  .route("/:id/approve")
  .patch(validateShopRequestBeforeApprove, confirmShopRequest);
router
  .route("/:id/reject")
  .patch(validateShopRequestBeforeReject, rejectShopRequest);

export default router;
