import { handleGetMessages } from "./messageService";

const getMessages = async (req: any, res: any) => {
  try {
    const profileId = req.query.profileId;
    const messages = await handleGetMessages(profileId, req.user);
    res.send(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export { getMessages };
