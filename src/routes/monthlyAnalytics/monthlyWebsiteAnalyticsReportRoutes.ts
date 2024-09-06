import { Router } from "express";

import { protect, restrictTo } from "../../middlewares/authMiddleware";

const router = Router();
router.use(protect, restrictTo("admin"));

export default router;
