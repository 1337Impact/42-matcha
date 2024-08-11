import { getViewes, isProfileViewed, vieweProfile } from "./viewsControllers";
import { Router } from "express";

const router = Router();

router.post("/view-profile", vieweProfile);
router.get("/", getViewes);
router.get("/is-profile-viewed", isProfileViewed);

export default router;
