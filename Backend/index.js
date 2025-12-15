import express from "express";

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

import { app, server } from "./SocketIO/server.js";

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

// DATABASE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// ROUTES
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

// START SERVER
const PORT = process.env.PORT || 4002;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
