import { Router } from "express";
import { signUpWithEmail, loginWithEmail } from "../controllers/authController";
const router = Router();

router.route("/signup").post(signUpWithEmail);
router.route("/login").post(loginWithEmail);

export default router;
