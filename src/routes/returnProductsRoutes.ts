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
} from "../controllers/returnProductsController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateBeforeReturnRequest } from "../middlewares/returnProductsMiddleware";
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
router.route("/approve/:id").patch(approveReturnItems);
router.route("/reject/:id").patch(rejectReturnItems);
router.route("/:id/item").get(getReturnItemRequest);

export default router;
