import { Router } from "express";
import {
  getAllProcessedShopRequests,
  getProcessedShopRequest,
  updateProcessedShopRequest,
  deleteProcessedShopRequest,
} from "../../controllers/processedData/processedCreateShopRequestsController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";
const router = Router();
router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getAllProcessedShopRequests);

router
  .route("/:id")
  .get(getProcessedShopRequest)
  .patch(updateProcessedShopRequest)
  .delete(deleteProcessedShopRequest);

export default router;
