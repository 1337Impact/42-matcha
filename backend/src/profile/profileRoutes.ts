import { Router } from "express";
import multer from "multer";
import eventsRouter from "./events/eventsRoutes";
import LikesRouter from "./likes/likesRoutes";
import {
  blockUser,
  getAllProfiles,
  getConnections,
  getFilteredProfiles,
  getGeoLocation,
  getMapProfiles,
  getNotifications,
  getProfile,
  isProfileCompleted,
  reportUser,
  updateProfile,
  updateProfileSettings
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
router.use("/events", eventsRouter);
router.post("/report", reportUser);
router.post("/block", blockUser);
router.post("/update", upload.array("images", 5), updateProfile);
router.post("/settings", upload.array("images", 5), updateProfileSettings);
router.post("/iscompleted", isProfileCompleted);
router.get("/", getProfile);
router.get("/connections", getConnections);
router.get("/all", getAllProfiles);
router.post("/FilteredProfiles", getFilteredProfiles);
router.get("/map", getMapProfiles);
router.get("/notifications", getNotifications);



export default router;
