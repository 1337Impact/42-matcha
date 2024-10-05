import { sendNotification } from "../../utils/socket";
import { User } from "../types";
import {
  handleGetIsProfileLiked,
  handleGetLikes,
  handleLikeProfile,
  handleLikeProfileHome,
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
    const response = await handleLikeProfile(profileId, req.user);
    if (response) {
      sendNotification(
        {
          content: `@${req.user.username} has liked you profile.`,
          type: "like",
        },
        profileId
      );
      res.send("profile liked");
    } else {
      if (
        await handleGetIsProfileLiked(req.user.id, { id: profileId } as User)
      ) {
        sendNotification(
          {
            content: `@${req.user.username} has unliked your profile.`,
            type: "unlike",
          },
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

const likeProfileHome = async (req: any, res: any) => {
  try {
    const profileId = req.body.profileId;
    const response = await handleLikeProfileHome(profileId, req.user);
    sendNotification(
      {
        content: `@${req.user.username} has liked you profile.`,
        type: "like",
      },
      profileId
    );
    res.send("profile liked");
  } catch (error) {
    console.error("Error liking profile:", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};

const dislikeProfile = async (req: any, res: any) => {
  try {
    const profileId = req.body.profileId;
    const response = await handleLikeProfile(profileId, req.user);
    if (!response) {
      sendNotification(
        {
          content: `@${req.user.username} has unliked your profile.`,
          type: "unlike",
        },
        profileId
      );
      res.send("profile unliked");
    }
  } catch (error) {
    console.error("Error disliking profile:", error);
    res.status(400).send({ error: "Something went wrong." });
  }
};

const isProfileLiked = async (req: any, res: any) => {
  try {
    const profileId = req.query.profileId;
    //"isProfileLiked: ", profileId);
    const isLiked = await handleGetIsProfileLiked(profileId, req.user);
    res.send(isLiked);
  } catch (error) {
    console.error("Error getting likes:", error);
    throw error;
  }
};
export { getLikes, likeProfile, isProfileLiked, dislikeProfile, likeProfileHome };
