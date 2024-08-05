import { verifyToken } from "../utils/jwtUtils";
import { getIsProfileCompleted, handleUpdateProfile } from "./profileService";

const updateProfile = async (req: any, res: any) => {
  try {
    const images = JSON.stringify(req.files.map((file: any) => file.path));
    await handleUpdateProfile({...req.body, images: images}, req.user);
    res.send("Profile updated successfully");
  } catch (error) {
      res.status(400).send({ error: "Something went wrong." });
    }
};

const isProfileCompleted = async (req: any, res: any) => {
  try {
    const isCompleted = await getIsProfileCompleted(req.user);
    res.send({ isCompleted });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

export {updateProfile, isProfileCompleted};