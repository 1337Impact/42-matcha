import { dislikeProfile, getLikes, isProfileLiked, likeProfile, likeProfileHome } from "./likesControllers";
import { Router } from "express";

const router = Router();

router.post("/like-profile", likeProfile);
router.post("/like-profile-home", likeProfileHome);
router.post("/dislike-profile", dislikeProfile);
router.get("/", getLikes);
router.get("/is-profile-liked", isProfileLiked);

export default router;
