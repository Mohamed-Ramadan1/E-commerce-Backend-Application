import { Router } from "express";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import {
  validateRequestBeforeShopRequestCreation,
  validateShopRequestBeforeApprove,
} from "../middlewares/shopRequestMiddleware";

import {
  createShopRequest,
  cancelShopRequest,
  getAllPendingShopsRequests,
  getShopRequest,
  updateShopRequest,
  deleteShopRequest,
  confirmShopRequest,
  rejectShopRequest,
} from "../controllers/shopRequestController";
const router = Router();

router.use(protect);

// user operations
router.route("/:id/cancel").patch(cancelShopRequest);

router.use(restrictTo("admin"));

router
  .route("/")
  .get(getAllPendingShopsRequests)
  .post(validateRequestBeforeShopRequestCreation, createShopRequest);
router
  .route("/:id")
  .get(getShopRequest)
  .patch(updateShopRequest)
  .delete(deleteShopRequest);

router
  .route("/:id/approve")
  .patch(validateShopRequestBeforeApprove, confirmShopRequest);
router.route("/:id/reject").patch(rejectShopRequest);

export default router;
