import db from "../utils/db/client";

async function handleGetMessages(
  profileId: string,
  user: User
): Promise<Message[]> {
  try {
    const query = `SELECT * FROM "Message" 
    WHERE (sender_id = $1 AND receiver_id = $2)
    OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY time;`;
    const { rows } = await db.query(query, [user.id, profileId]);
    return rows;
  } catch (error) {
    console.error("Error getting likes:", error);
    throw error;
  }
}

async function handleCreateMessage(
  msg: any,
  user: User
): Promise<Message[]> {
  try {
    const query = `INSERT INTO "Message" (sender_id, receiver_id, content) VALUES ($1, $2, $3);`;
    const { rows } = await db.query(query, [user.id, user.id, msg.receiver_id, msg.content]);
    return rows;
  } catch (error) {
    console.error("Error getting likes:", error);
    throw error;
  }
}

export { handleGetMessages, handleCreateMessage };
