import bcrypt from "bcrypt";
import {
  getIsProfileCompleted,
  handleBlockUser,
  handleGetAllProfiles,
  handleGetConnections,
  handleGetMapProfiles,
  handleGetNotifications,
  handleGetProfile,
  handleGetgetFilteredProfiles,
  handleLikeProfile,
  handleReportUser,
  handleSetGeoLocation,
  handleUpdateProfile,
  handleUpdateProfileSettings,
} from "./profileService";

const getProfile = async (req: any, res: any) => {
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

const getMapProfiles = async (req: any, res: any) => {
  try {
    const data = await handleGetMapProfiles(req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const getFilteredProfiles = async (req: any, res: any) => {
  try {
    const data = await handleGetgetFilteredProfiles(
      req.user,
      req.body.ProfilesFilter
    );

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

const mergeArrays = (
  newImages: string[],
  imageFiles: Express.Multer.File[]
) => {
  let fillIndex = 0;

  return newImages.map((item: string) => {
    if (item === "" && fillIndex < imageFiles.length) {
      return `${process.env.BACKEND_URL}/uploads/${
        imageFiles[fillIndex++].filename
      }`;
    }
    return item;
  });
};

const updateProfile = async (req: any, res: any) => {
  try {
    const images = JSON.stringify(
      mergeArrays(JSON.parse(req.body.images), req.files)
    );

    let hashedPassword = null;
    if (req.body.new_password) {
      if (req.body.new_password !== req.body.confirm_password) {
        return res.status(405).send({ error: "Passwords do not match" });
      }
      hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    }

    await handleUpdateProfile(
      {
        gender: req.body.gender,
        sexual_preferences: req.body.sexual_preferences,
        biography: req.body.biography,
        tags: req.body.tags,
        images: images,
        age: req.body.age,
      },
      req.user
    );
    handleSetGeoLocation(req.user.id);
    res.send("Profile updated successfully");
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

export const updateProfileSettings = async (req: any, res: any) => {
  try {
    const images = JSON.stringify(
      mergeArrays(JSON.parse(req.body.images), req.files)
    );


    let hashedPassword = null;
    if (req.body.new_password) {
      if (req.body.new_password !== req.body.confirm_password) {
        return res.status(400).send({ error: "Passwords do not match" });
      }
      hashedPassword = await bcrypt.hash(req.body.new_password, 10);
    }

    await handleUpdateProfileSettings(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        sexual_preferences: req.body.sexual_preferences,
        biography: req.body.biography,
        tags: req.body.tags,
        images: images,
        new_password: hashedPassword as string,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        age: req.body.age,
      },
      req.user
    );

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
};

const isProfileCompleted = async (req: any, res: any) => {
  try {
    const isCompleted = await getIsProfileCompleted(req.body.user);
    res.send({ isCompleted });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const getGeoLocation = async (req: any, res: any) => {
  try {
    const data = await handleSetGeoLocation(req.user.id);
  } catch (error) {
    console.error("Error getting geo location: ", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};

const reportUser = async (req: any, res: any) => {
  try {
    const data = await handleReportUser(req.body.userId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const blockUser = async (req: any, res: any) => {
  try {
    const data = await handleBlockUser(req.body.userId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const getNotifications = async (req: any, res: any) => {
  try {
    const data = await handleGetNotifications(req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

export {
  blockUser,
  getAllProfiles,
  getConnections,
  getFilteredProfiles,
  getGeoLocation,
  getMapProfiles,
  getProfile,
  isProfileCompleted,
  likeProfile,
  reportUser,
  updateProfile,
  getNotifications,
};
