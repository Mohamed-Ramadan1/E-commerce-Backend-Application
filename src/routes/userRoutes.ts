import { Router } from "express";
import { createUser } from "../controllers/userController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
const router = Router();

router.route("/").post(protect, restrictTo("admin"), createUser);
export default router;
