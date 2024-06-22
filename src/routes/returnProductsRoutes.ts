import { Router } from "express";
import {
  requestReturnItems,
  cancelReturnRequest,
  getAllMyReturnItems,
  getMyReturnRequestItem,
  updateReturnItemRequest,
  deleteReturnItemRequest,
  getAllReturnItemsRequests,
  getReturnItemRequest,
  approveReturnItems,
  rejectReturnItems,
} from "../controllers/returnProductsController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
import { validateBeforeReturnRequest } from "../middlewares/returnProductsMiddleware";
const router = Router();

router
  .route("/")
  .post(protect, validateBeforeReturnRequest, requestReturnItems);

export default router;
