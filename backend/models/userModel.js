
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    contact: { type: String, trim: true },
    role: { type: String, enum: ["jobseeker", "employer", "admin"], required: true },
    location: { type: String, trim: true },
    bio: { type: String, trim: true },
    about: { type: String, trim: true },
    profilePic: { type: String, default: "" },
    bgImage: { type: String, default: "" },  // <-- ADD THIS LINE HERE
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
