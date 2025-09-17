import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config()
import connectDB from "./config/mongodb.js";   // connecting mongodb
import connectCloudinary from "./config/cloudinary.js";   //connecting cloudinary
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import savedPostsRoutes from "./routes/savedPostsRoutes.js";

const allowedOrigins = ["http://localhost:5173"]







const app = express();

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();


// Middleware to parse JSON and handle CORS
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved-posts", savedPostsRoutes);

// Basic health check endpoint
app.get("/", (req, res) => {
  res.send("SkillConnect API is running");
});


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
