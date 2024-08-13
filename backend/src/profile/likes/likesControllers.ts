import { sendNotification } from "../../utils/socket";
import { User } from "../types";
import {
  handleGetIsProfileLiked,
  handleGetLikes,
  handleLikeProfile,
} from "./likesService";

const getLikes = async (req: any, res: any) => {
  try {
    const data = await handleGetLikes(req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const likeProfile = async (req: any, res: any) => {
  try {
    const profileId = req.body.profileId;
    console.log("like profile: ", profileId);
    const response = await handleLikeProfile(profileId, req.user);
    // handle notification
    if (response) {
      sendNotification(
        { message: `You have a new like from @${req.user.username}` },
        profileId
      );
      res.send("profile liked");
    } else {
      if (
        await handleGetIsProfileLiked(req.user.id, { id: profileId } as User)
      ) {
        sendNotification(
          { message: `You have been unliked from @${req.user.username}` },
          profileId
        );
      }
      res.send("profile unliked");
    }
  } catch (error) {
    console.error("Error liking profile:", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};

const isProfileLiked = async (req: any, res: any) => {
  try {
    const profileId = req.query.profileId;
    console.log("isProfileLiked: ", profileId);
    const isLiked = await handleGetIsProfileLiked(profileId, req.user);
    res.send(isLiked);
  } catch (error) {
    console.error("Error getting likes:", error);
    throw error;
  }
};
export { getLikes, likeProfile, isProfileLiked };
