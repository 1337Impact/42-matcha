import { getMessages } from "./messageControllers";
import { Router } from "express";

const router = Router();



// router.post("/", likeProfile);
router.get("/", getMessages);
// router.get("/", isProfileLiked);

export default router;
