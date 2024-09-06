import { Router } from "express";
import {
  getAllProcessedDeleteShopRequests,
  getProcessedDeleteShopRequest,
  createProcessedDeleteShopRequest,
  updateProcessedDeleteShopRequest,
  deleteProcessedDeleteShopRequest,
} from "../../controllers/processedData/processedDeleteShopRequestController";
import { protect, restrictTo } from "../../middlewares/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router
  .route("/")
  .get(getAllProcessedDeleteShopRequests)
  .post(createProcessedDeleteShopRequest);
router
  .route("/:id")
  .get(getProcessedDeleteShopRequest)
  .patch(updateProcessedDeleteShopRequest)
  .delete(deleteProcessedDeleteShopRequest);

export default router;
