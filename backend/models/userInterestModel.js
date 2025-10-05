import mongoose from "mongoose";

const userInterestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
}, { timestamps: true });

const UserInterest = mongoose.model("UserInterest", userInterestSchema);

export default UserInterest;
