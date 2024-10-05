import { io, userSocketMap } from "../app";
import db from "../utils/db/client";

async function sendNotification(message: any, receiver_id: string) {
  try {
    const receiverSocketId = userSocketMap.get(receiver_id);
    const query = `INSERT INTO "Notification" (user_id, content, type) VALUES ($1, $2, $3);`;
    await db.query(query, [receiver_id, message.content, message.type]);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("notification", message);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

function handleVideoCall(io: any, socket: any) {
  socket.on("rtc-message", (data: any) => {
    const { receiver_id, ...rest } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("rtc-message", rest);
    }
  });

  socket.on("request-call", (data: any) => {
    const { receiver_id, ...rest } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", rest);
    }
  });
}

export { sendNotification, handleVideoCall };
