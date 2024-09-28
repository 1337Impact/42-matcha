import express from "express";
import bodyParser from "body-parser";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";
import profileRouter from "./profile/profileRoutes";
import messageRouter from "./messages/messageRoutes";
import authorize, { socketMiddlware } from "./middleware";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { handleCreateMessage } from "./messages/messageService";
import passport from "./auth/passportSetup";
import { handleVideoCall } from "./utils/socket";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "",
  cors: {
    origin: "*",
  },
});

const corsOptions = {
  origin: "*",
};

const userSocketMap = new Map();

io.engine.use(socketMiddlware);

io.on("connection", (socket) => {
  // @ts-ignore
  const user = socket.request.user;
  userSocketMap.set(user.id, socket.id);
  console.log("user connected: ", user.id);

  socket.on("disconnect", () => {
    userSocketMap.delete(user.id);
  });

  socket.on("message", async (msg) => {
    const receiverSocketId = userSocketMap.get(msg.receiver_id);
    const res = await handleCreateMessage(msg, user);
    io.to(receiverSocketId).emit("message", {
      id: "",
      content: msg.content,
      sender_id: user.id,
    });
  });
  handleVideoCall(io, socket);
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(passport.initialize()); // Initialize passport
app.use("/images", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/profile", authorize, profileRouter);
app.use("/api/user", authorize, userRouter);
app.use("/api/message", authorize, messageRouter);

export { io, userSocketMap };
export default httpServer;
