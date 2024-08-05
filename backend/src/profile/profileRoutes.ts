import { updateProfile, uploadImages } from "./profileControllers";
import { Router } from "express";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

router.post("/update-profile", upload.array("images", 5),  updateProfile);

export default router;
