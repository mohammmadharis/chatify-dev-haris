import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

// ROUTES
import userRoute from "../routes/user.route.js";
import messageRoute from "../routes/message.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://chatify-dev-haris.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// MONGODB CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// ROUTES
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// -------------------- SOCKET.IO --------------------
const io = new Server(server, {
  cors: {
    origin: [
      "https://chatify-dev-haris.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// users object: { userId: [socketId1, socketId2] }
const users = {};

// get all socket IDs for a receiver
export const getReceiverSocketId = (receiverId) => users[receiverId] || [];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    if (!users[userId]) users[userId] = [];
    users[userId].push(socket.id);
    console.log("Connected users:", users);
  }

  // broadcast online users
  io.emit("getOnlineUsers", Object.keys(users));

  // disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId && users[userId]) {
      users[userId] = users[userId].filter(id => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }
    io.emit("getOnlineUsers", Object.keys(users));
  });

  // Listen for sending messages
  socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSockets = getReceiverSocketId(receiverId);
    receiverSockets.forEach(socketId => {
      io.to(socketId).emit("receiveMessage", message);
    });
  });
});

export { app, io, server };

// START SERVER
const PORT = process.env.PORT || 4002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
