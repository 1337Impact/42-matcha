import { login } from "./authControllers";
import { Router } from "express";

const router = Router();

router.post("/login", login);

export default router;
