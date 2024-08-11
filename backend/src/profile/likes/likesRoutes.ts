import { getLikes, isProfileLiked, likeProfile } from "./likesControllers";
import { Router } from "express";

const router = Router();

router.post("/like-profile", likeProfile);
router.get("/", getLikes);
router.get("/is-profile-liked", isProfileLiked);

export default router;
