import { io, userSocketMap } from "../app";

function sendNotification(message: any, receiver_id: string) {
    const receiverSocketId = userSocketMap.get(receiver_id);
    console.log("sendNotification", message, receiverSocketId);
  io.to(receiverSocketId).emit("notification", message);
}

export { sendNotification };