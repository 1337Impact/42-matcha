import { io, userSocketMap } from "../app";

function sendNotification(message: any, receiver_id: string) {
  const receiverSocketId = userSocketMap.get(receiver_id);
  //"sendNotification", message, receiverSocketId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("notification", message);
  }
}

function handleVideoCall(io: any, socket: any) {
  socket.on("rtc-message", (data: any) => {
    const { receiver_id, ...rest } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("rtc-message", rest);
    }
    console.log("rtc-message", data);
  });

  socket.on("request-call", (data: any) => {
    const { receiver_id, ...rest } = data;
    const receiverSocketId = userSocketMap.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", rest);
    }
    console.log("incoming-call", data);
  });

  // socket.on("video-answer", (data: any) => {
  //   const { receiver_id, answer } = data;
  //   const receiverSocketId = userSocketMap.get(receiver_id);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("video-answer", answer);
  //   }
  //   console.log("video-answer", data);
  // });
  // socket.on("ice-candidate", (data: any) => {
  //   const { receiver_id, ice_candidate } = data;
  //   const receiverSocketId = userSocketMap.get(receiver_id);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit("ice-candidate", ice_candidate);
  //   }
  //   console.log("ice-candidate", data);
  // });
}

export { sendNotification, handleVideoCall };
