import { Router } from "express";
import {
  requestReturnItems,
  cancelReturnRequest,
  getAllMyReturnItems,
  getMyReturnRequestItem,
  deleteReturnItemRequest,
  approveReturnItems,
  getAllReturnItemsRequests,
  getReturnItemRequest,
  rejectReturnItems,
} from "../../controllers/products/returnProductsController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

import {
  validateBeforeReturnRequest,
  validateBeforeProcessReturnRequests,
} from "../../middlewares/products/returnProductsMiddleware";
const router = Router();

router.use(protect);

router.route("/all").get(restrictTo("admin"), getAllReturnItemsRequests);

// User Routes
router
  .route("/")
  .get(getAllMyReturnItems)
  .post(validateBeforeReturnRequest, requestReturnItems);

router.route("/cancel/:id").patch(cancelReturnRequest);
router
  .route("/:id")
  .get(getMyReturnRequestItem)
  .delete(deleteReturnItemRequest);

//admin/manager Routes

router.use(restrictTo("admin"));
router
  .route("/:id/approve")
  .patch(validateBeforeProcessReturnRequests, approveReturnItems);
router
  .route("/:id/reject")
  .patch(validateBeforeProcessReturnRequests, rejectReturnItems);
router.route("/:id/item").get(getReturnItemRequest);

export default router;
