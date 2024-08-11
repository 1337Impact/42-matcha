import { getViewes, getViewesHistory, isProfileViewed, vieweProfile } from "./viewsControllers";
import { Router } from "express";

const router = Router();

router.post("/view-profile", vieweProfile);
router.get("/", getViewes);
router.get("/history", getViewesHistory);
router.get("/is-profile-viewed", isProfileViewed);

export default router;
