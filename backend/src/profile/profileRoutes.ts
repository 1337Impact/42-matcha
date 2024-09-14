import { Router } from "express";
import multer from "multer";
import LikesRouter from "./likes/likesRoutes";
import {
  getAllProfiles,
  getConnections,
  getGeoLocation,
  getProfile,
  isProfileCompleted,
  updateProfile,
  updateProfileSettings,
} from "./profileControllers";
import viewsRouter from "./views/viewsRoutes";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.use("/likes", LikesRouter);
router.use("/views", viewsRouter);
// Update profile (for incomplete profile updates)
router.post("/update", upload.array("images", 5), updateProfile);
// Update profile settings
router.post("/settings", upload.array("images"), updateProfileSettings);
router.post("/iscompleted", isProfileCompleted);
router.get("/", getProfile);
router.get("/connections", getConnections);
router.get("/all", getAllProfiles);
router.post("/geolocation", getGeoLocation);

export default router;
