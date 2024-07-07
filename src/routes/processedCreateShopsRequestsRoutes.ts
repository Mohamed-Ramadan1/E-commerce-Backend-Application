import { Router } from "express";
import {
  getAllProcessedShopRequests,
  getProcessedShopRequest,
  updateProcessedShopRequest,
  deleteProcessedShopRequest,
} from "../controllers/processedCreateShopRequestsController";
import { restrictTo, protect } from "../middlewares/authMiddleware";
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
