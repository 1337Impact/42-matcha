import express from "express";
import bodyParser from "body-parser";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";
import profileRouter from "./profile/profileRoutes";
import authorize from "./middleware";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    path: "",
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("a user connected: ", socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on('message', (msg) => {
        console.log('message received: ', msg);
        io.to(msg.received).emit('message', msg.content);
      });
});


app.use(cors());
app.use("/images", express.static("uploads"));

app.use(bodyParser.json());
app.use("/api/auth", authRouter);
app.use("/api/profile", authorize, profileRouter);
app.use("/api/user", authorize, userRouter);

export default httpServer;
