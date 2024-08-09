import { verifyToken } from "../utils/jwtUtils";
import {
  getIsProfileCompleted,
  handleGetAllProfiles,
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

const getAllProfiles = async (req: any, res: any) => {
  try {
    const data = await handleGetAllProfiles(req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const mergeArrays = (newImages: string[], imageFiles: any) => {
  let fillIndex = 0;

  return newImages.map((item: string) => {
      if (item === "" && fillIndex < imageFiles.length) {
          return `${process.env.BACKEND_URL}/images/${imageFiles[fillIndex++].filename}`
      }
      return item;
  });
}

const updateProfile = async (req: any, res: any) => {
  try {
    console.log("req.body: ", req.body);
    const images = JSON.stringify(mergeArrays(JSON.parse(req.body.images), req.files));
    console.log("images: ", images);
    await handleUpdateProfile({ ...req.body, images: images }, req.user);
    res.send("Profile updated successfully");
  } catch (error) {
    console.log("update profile error: ", error);
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

export { getProfile, getAllProfiles, updateProfile, isProfileCompleted };
