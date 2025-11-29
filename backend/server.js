import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import connectDB from "./config/mongodb.js";
import { initCloudinary } from "./config/cloudinary.js";

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import savedPostsRoutes from "./routes/savedPostsRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const allowedOrigins = ["http://localhost:5173"];
const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


export const userSocketMap = {};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("jwt must be provided"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId || decoded._id;
    next();
  } catch {
    next(new Error("invalid jwt"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("User Connected", userId);
  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export const emitNotificationToUser = (userId, notificationData) => {
  const socketId = userSocketMap[userId];
  if (socketId) {
    io.to(socketId).emit('newNotification', notificationData);
    console.log(`Emitted newNotification to user ${userId} on socket ${socketId}`);
  }
};

app.use(express.json({ limit: "50mb" }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved-posts", savedPostsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Append resume routes here
app.use("/api/resumes", resumeRoutes);

app.get("/", (req, res) => {
  res.send("SkillConnect API is running");
});

// Error handler middleware
app.use(errorHandler);

const connectCloudinary = () => {
  if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
    throw new Error("Cloudinary environment variables missing!");
  }
  console.log("Cloudinary environment variables present.");
};

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();
    initCloudinary();

    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
