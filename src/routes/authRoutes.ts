import { Router } from "express";
import {
  signUpWithEmail,
  loginWithEmail,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.route("/signup").post(signUpWithEmail);

router.route("/login").post(loginWithEmail);

router.route("/logout").post(protect, logout);

router.route("/forgot-password").post(forgotPassword);

router.route("/verify-email/:token").get(verifyEmail);

router.route("/reset-password/:token").patch(resetPassword);

export default router;
