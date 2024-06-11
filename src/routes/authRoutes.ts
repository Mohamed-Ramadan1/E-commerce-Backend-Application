import { Router } from "express";
import {
  signUpWithEmail,
  loginWithEmail,
  logout,
} from "../controllers/authController";
import { protect, restrictTo } from "../middlewares/authMiddleware";
const router = Router();

router.route("/signup").post(signUpWithEmail);
router.route("/login").post(loginWithEmail);
router.route("/logout").post(protect, logout);

export default router;
