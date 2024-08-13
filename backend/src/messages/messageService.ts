import { User } from "../profile/types";
import Message from "../types/message";
import db from "../utils/db/client";
import { sendNotification } from "../utils/socket";

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
    console.error("Error getting messages:", error);
    throw error;
  }
}

async function handleCreateMessage(msg: any, user: User): Promise<Message[]> {
  try {
    const query = `INSERT INTO "Message" (sender_id, receiver_id, content) VALUES ($1, $2, $3);`;
    const { rows } = await db.query(query, [
      user.id,
      msg.receiver_id,
      msg.content,
    ]);
    sendNotification(
      { content: `@${user.username} has sent you a message.`, type: "message" },
      msg.receiver_id
    );
    return rows[0];
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

export { handleGetMessages, handleCreateMessage };
