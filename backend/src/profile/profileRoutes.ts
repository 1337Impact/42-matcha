import { getAllProfiles, getProfile, isProfileCompleted, updateProfile } from "./profileControllers";
import { Router } from "express";
import multer from "multer";

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

router.post("/update", upload.array("images", 5), updateProfile);
router.get("/", getProfile);
router.get("/all", getAllProfiles);
router.post("/iscompleted", isProfileCompleted);

export default router;
