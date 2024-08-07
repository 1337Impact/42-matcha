import { verifyToken } from "../utils/jwtUtils";
import {
  getIsProfileCompleted,
  handleGetProfile,
  handleUpdateProfile,
} from "./profileService";

const getProfile = async (req: any, res: any) => {
  console.log("req: ", req.query);
  const query = req.query;
  try {
    const profileId =
      !query.profileId || query.profileId === "me"
        ? req.user.id
        : query.profileId;
    const data = await handleGetProfile(profileId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const updateProfile = async (req: any, res: any) => {
  try {
    const images = JSON.stringify(
      req.files.map(
        (file: any) => `${process.env.BACKEND_URL}/images/${file.filename}`
      )
    );
    await handleUpdateProfile({ ...req.body, images: images }, req.user);
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

export { getProfile, updateProfile, isProfileCompleted };
