import { login, signup, verifyEmail } from "./authControllers";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/verify", verifyEmail);

export default router;
