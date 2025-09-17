import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant reference is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: "",
    },
    about: {
      type: String,
      required: [true, "About section is required"],
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one skill is required",
      },
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, trim: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);