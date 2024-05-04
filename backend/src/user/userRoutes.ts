import { getUser } from "./userControllers";
import { Router } from "express";

const router = Router();

router.get("/test", getUser);

export default router;
