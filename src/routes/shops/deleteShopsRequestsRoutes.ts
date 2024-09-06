import { Router } from "express";
import {
  validateBeforeApproveDeleteShopRequest,
  validateBeforeCreateDeleteShopRequest,
} from "../../middlewares/deleteShopRequestMiddleware";
import { protect, restrictTo } from "../../middlewares/authMiddleware";
import {
  getAllDeleteShopRequests,
  getDeleteShopRequest,
  createDeleteShopRequest,
  updateDeleteShopRequest,
  deleteDeleteShopRequest,
  approveDeleteShopRequest,
  rejectDeleteShopRequest,
  cancelDeleteShopRequest,
} from "../../controllers/shop/deleteShopRequestController";
const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router
  .route("/")
  .get(getAllDeleteShopRequests)
  .post(validateBeforeCreateDeleteShopRequest, createDeleteShopRequest);
router
  .route("/:id")
  .get(getDeleteShopRequest)
  .patch(updateDeleteShopRequest)
  .delete(deleteDeleteShopRequest);

router
  .route("/:id/approve")
  .patch(validateBeforeApproveDeleteShopRequest, approveDeleteShopRequest);
router
  .route("/:id/reject")
  .patch(validateBeforeApproveDeleteShopRequest, rejectDeleteShopRequest);
router
  .route("/:id/cancel")
  .patch(validateBeforeApproveDeleteShopRequest, cancelDeleteShopRequest);

export default router;
