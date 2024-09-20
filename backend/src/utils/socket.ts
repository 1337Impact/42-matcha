import { io, userSocketMap } from "../app";

function sendNotification(message: any, receiver_id: string) {
  const receiverSocketId = userSocketMap.get(receiver_id);
  //"sendNotification", message, receiverSocketId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", message);
  }
}

export { sendNotification };
