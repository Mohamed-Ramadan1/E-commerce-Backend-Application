import { Router } from "express";
import { signUpWithEmail } from "../controllers/authController";
const router = Router();

router.route("/signup").post(signUpWithEmail);
export default router;
