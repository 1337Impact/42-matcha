import { io, userSocketMap } from "../app";

function sendNotification(message: any, receiver_id: string) {
  const receiverSocketId = userSocketMap.get(receiver_id);
  //"sendNotification", message, receiverSocketId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", message);
  }
}

function handleVideoCall(io: any, socket: any) {
  socket.on("video-offer", (data: any) => {
    const { receiver_id, offer } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("video-offer", offer);
    }
    console.log("video-offer", data);
  });

  socket.on("video-answer", (data: any) => {
    const { receiver_id, answer } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("video-answer", answer);
    }
    console.log("video-answer", data);
  });
}

export { sendNotification, handleVideoCall };
