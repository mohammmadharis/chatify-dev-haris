import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

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

const users = {};

export const getReceiverSocketId = (receiverId) => users[receiverId] || [];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    if (!users[userId]) users[userId] = [];
    users[userId].push(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    if (userId && users[userId]) {
      users[userId] = users[userId].filter(id => id !== socket.id);
      if (users[userId].length === 0) delete users[userId];
    }
    io.emit("getOnlineUsers", Object.keys(users));
  });

  socket.on("sendMessage", ({ receiverId, message }) => {
    const receiverSockets = getReceiverSocketId(receiverId);
    receiverSockets.forEach(socketId => {
      io.to(socketId).emit("receiveMessage", message);
    });
  });
});

export { app, io, server };
