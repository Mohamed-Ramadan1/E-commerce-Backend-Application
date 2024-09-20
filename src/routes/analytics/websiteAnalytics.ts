import { Router } from "express";

import { protect } from "../../middlewares/auth/authMiddleware";

const router = Router();
router.use(protect);

export default router;
