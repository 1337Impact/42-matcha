import { login, signup, verifyEmail } from "./authControllers";
import { Router } from "express";
import { handleForgetPasswordEamil } from "./authService";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post('/request-reset-password', handleForgetPasswordEamil);
router.post('/reset-password/', handleForgetPasswordEamil);
export default router;
