import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: String }, // e.g., "Just now", or timestamp string
  description: { type: String }, // full job description (maps to content)
  profilePic: { type: String }, // URL for author/company profile pic (optional, can derive via ref)
  address: { type: String },
  workType: { type: String, default: "Full Time" },
  salary: { type: String },
  jobImage: { type: String },
  workingHour: { type: String },
  holiday: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Add more fields as needed: company ID, applicants, status, etc.
});

export default mongoose.model("Job", jobSchema);
