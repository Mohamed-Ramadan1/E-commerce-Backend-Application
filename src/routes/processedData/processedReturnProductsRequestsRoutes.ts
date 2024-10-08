import { Router } from "express";
import {
  getProcessedReturnProductRequest,
  getProcessedReturnProductRequests,
  updateProcessedReturnProductRequest,
  deleteProcessedReturnProductRequest,
} from "../../controllers/processedData/processedReturnProductsRequestsController";
import { restrictTo, protect } from "../../middlewares/auth/authMiddleware";

const router = Router();

router.use(protect);
router.use(restrictTo("admin"));

router.route("/").get(getProcessedReturnProductRequests);

router
  .route("/:id")
  .get(getProcessedReturnProductRequest)
  .patch(updateProcessedReturnProductRequest)
  .delete(deleteProcessedReturnProductRequest);

export default router;
