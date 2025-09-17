import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }
});

export default mongoose.model("SavedPost", savedPostSchema);
