import {
  handleGetIsProfileViewed,
  handleGetViewesHistory,
  handleGetViews,
  handleViewedProfile,
} from "./viewsService";

const getViewes = async (req: any, res: any) => {
  try {
    const data = await handleGetViews(req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const getViewesHistory = async (req: any, res: any) => {
  try {
    const data = await handleGetViewesHistory(req.user);
    console.log("getViewesHistory: ", data); 
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
};

const vieweProfile = async (req: any, res: any) => {
  try {
    const profileId = req.body.profileId;
    console.log("view profile: ", profileId);
    const data = await handleViewedProfile(profileId, req.user);
    res.send(data);
  } catch (error) {
    res.status(400).send({ error: "Something went wrong." });
  }
}

const isProfileViewed = async (req: any, res: any) => {
  try {
    const profileId = req.query.profileId;
    console.log("isProfileViewed: ", profileId);
    const isViewed = await handleGetIsProfileViewed(profileId, req.user);
    res.send(isViewed);
  } catch (error) {
    console.error("Error getting viewes:", error);
    throw error;
  }
}
export { getViewes, vieweProfile, isProfileViewed, getViewesHistory };
