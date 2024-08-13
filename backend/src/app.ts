import express from "express";
import bodyParser from "body-parser";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";
import profileRouter from "./profile/profileRoutes";
import messageRouter from "./messages/messageRoutes";
import authorize, { socketMiddlware } from "./middleware";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { handleCreateMessage } from "./messages/messageService";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "",
  cors: {
    origin: "*",
  },
});

const userSocketMap = new Map();

io.engine.use(socketMiddlware);

io.on("connection", (socket) => {
  // @ts-ignore
  const userId = socket.request.user.id;
  //console.log("a user connected: ", userId);
  userSocketMap.set(userId, socket.id);

  socket.on("disconnect", () => {
    userSocketMap.delete(userId);
    //console.log("user disconnected: ", userId);
  });

  socket.on("message", async (msg) => {
    // //console.log("message received: ", msg, "from: ", userId);
    const receiverSocketId = userSocketMap.get(msg.receiver_id);
    //console.log("receiverSocketId: ", receiverSocketId);
    const res = await handleCreateMessage(msg, userId);
    //console.log("==> res: ", res);
    io.to(receiverSocketId).emit("message", {
      id: "",
      content: msg.content,
      sender_id: userId,
    });
  });
});

app.use(cors());
app.use("/images", express.static("uploads"));

app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/profile", authorize, profileRouter);
app.use("/api/user", authorize, userRouter);
app.use("/api/message", authorize, messageRouter);

export default httpServer;
