import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: String }, 
  description: { type: String }, 
  profilePic: { type: String }, 
  address: { type: String },
  workType: { type: String, default: "Full Time" },
  salary: { type: String },
  jobImage: { type: String },
  workingHour: { type: String },
  holiday: { type: String },
  createdAt: { type: Date, default: Date.now },
 
});

export default mongoose.model("Job", jobSchema);
