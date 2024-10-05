import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import { Server as SocketIOServer } from "socket.io";
import authRouter from "./auth/authRoutes";
import passport from "./auth/passportSetup";
import messageRouter from "./messages/messageRoutes";
import { handleCreateMessage } from "./messages/messageService";
import authorize, { socketMiddlware } from "./middleware";
import profileRouter from "./profile/profileRoutes";
import userRouter from "./user/userRoutes";
import { handleVideoCall } from "./utils/socket";

const privateKey = fs.readFileSync("/etc/nginx/ssl/cert.key", "utf8");
const certificate = fs.readFileSync("/etc/nginx/ssl/cert.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

const app = express();
const httpsServer = https.createServer(credentials, app);

const io = new SocketIOServer(httpsServer, {
  path: "",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "*",
};

const userSocketMap = new Map();

io.engine.use(socketMiddlware);

io.on("connection", (socket: any) => {
  const user = socket.request.user;
  userSocketMap.set(user.id, socket.id);

  socket.on("disconnect", () => {
    userSocketMap.delete(user.id);
  });

  socket.on("message", async (msg: any) => {
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
app.use(passport.initialize());
app.use("/api/auth", authRouter);
app.use("/api/profile", authorize, profileRouter);
app.use("/api/user", authorize, userRouter);
app.use("/api/message", authorize, messageRouter);
app.use("/uploads", express.static("uploads"));

export { io, userSocketMap };
export default httpsServer;
