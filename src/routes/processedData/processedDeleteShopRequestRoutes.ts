import { Router } from "express";
import {
  getAllProcessedDeleteShopRequests,
  getProcessedDeleteShopRequest,
  createProcessedDeleteShopRequest,
  updateProcessedDeleteShopRequest,
  deleteProcessedDeleteShopRequest,
} from "../../controllers/processedData/processedDeleteShopRequestController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

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
