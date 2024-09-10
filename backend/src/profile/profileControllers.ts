import { verifyToken } from "../utils/jwtUtils";
import bcrypt from "bcrypt";
import {
  getIsProfileCompleted,
  handleGetAllProfiles,
  handleGetConnections,
  handleGetProfile,
  handleLikeProfile,
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

const getConnections = async (req: any, res: any) => {
  try {
    const data = await handleGetConnections(req.user);
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
    console.log("req.body: ", req.body, "req.files: ", req.files, "req.user: ", req.user);
    const images = JSON.stringify(mergeArrays(JSON.parse(req.body.images), req.files));
    let hashedPassword = null;
    if (req.body.new_password) {
      // if (req.body.new_password !== req.body.confirm_password) {
      //   return res.status(405).send({ error: "Passwords do not match" });
      // }
      hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    }

    // Call function to update profile and optionally the password
    await handleUpdateProfile({ 
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      sexual_preferences: req.body.sexual_preferences,
      biography: req.body.biography,
      tags: req.body.tags,
      images: images,
      new_password: hashedPassword as string
    }, req.user);
    console.log("images: ", images);
    await handleUpdateProfile({ ...req.body, images: images }, req.user);
    res.send("Profile updated successfully");
  } catch (error) {
    console.log("update profile error: ", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};

export const updateProfileSettings = async (req:any, res: any) => {
  try {
    console.log("req", req, "req.body: " , req.body);

    // const imageFiles = req.body.files || [];
    // const imageFilesData = imageFiles.map((file:any) => ({
    //   filename: file.filename,
    //   path: file.path
    // }));

    // Parsing and merging image data
    const images = JSON.stringify(mergeArrays(JSON.parse(req.body.images), req.files));
    
    // Handle password update
    let hashedPassword = null;
    if (req.body.new_password) {
      if (req.body.new_password !== req.body.confirm_password) {
        return res.status(400).send({ error: "Passwords do not match" });
      }
      hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    }

    // Call function to update profile and optionally the password
    await handleUpdateProfile({ 
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      sexual_preferences: req.body.sexual_preferences,
      biography: req.body.biography,
      tags: JSON.parse(req.body.tags || '[]'),
      images: images,
      new_password: hashedPassword as string
    }, req.user);
    
    res.send("Profile settings updated successfully");
  } catch (error) {
    console.error("Update profile settings error: ", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};


const likeProfile = async (req: any, res: any) => {
  try {
    const profileId = req.body.profileId;
    const data = await handleLikeProfile(profileId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
}

const isProfileCompleted = async (req: any, res: any) => {
  try {
    console.log("req.user: ", req.body.user);
    const isCompleted = await getIsProfileCompleted(req.body.user);
    res.send({ isCompleted });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

export { getProfile, getAllProfiles, getConnections, updateProfile, isProfileCompleted, likeProfile };
