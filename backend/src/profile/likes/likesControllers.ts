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
    const data = await handleLikeProfile(profileId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
}

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
}
export { getLikes, likeProfile, isProfileLiked };
