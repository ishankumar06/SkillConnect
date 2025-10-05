import mongoose from "mongoose";
import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import UserInterest from "../models/userInterestModel.js";
import { createNotification } from "../config/createNotification.js";
import { emitNotificationToUser } from "../server.js";

// Get followers: all users who have `userId` in their connections array
async function getFollowers(userId) {
  try {
    const followers = await User.find({ connections: userId }).select('_id');
    return followers.map(follower => follower._id.toString());
  } catch (err) {
    console.error("Error retrieving followers:", err);
    return [];
  }
}

// Create a new job and notify followers/connections
export const createJob = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.log("Unauthorized request: missing user");
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    const { author, content, image, ...otherFields } = req.body;

    const jobData = {
      ...otherFields,
      author: req.user.userId,
      description: content || "",
      jobImage: image || "",
    };

    console.log("Preparing to save job:", jobData);

    const job = new Job(jobData);
    await job.save();
    console.log("Job saved:", job);

    // Notify followers/connections about the new job
    const followers = await getFollowers(req.user.userId);
    console.log(`Followers for notification:`, followers);

    if (!followers || followers.length === 0) {
      console.log("No followers found to notify.");
    }

    for (const followerId of followers) {
      console.log(`Creating notification for follower ${followerId}`);

      const notification = await createNotification({
        userId: followerId,
        type: "newJobByConnection",
        fromUserId: req.user.userId,
        jobId: job._id,
        message: `Your connection posted a new job: "${job.title}"`,
        link: `/job/${job._id}`, // Redirect link to job details
      });

      console.log(`Notification created for follower ${followerId}:`, notification);

      emitNotificationToUser(followerId.toString(), notification);
      console.log(`Notification emitted to user ${followerId}`);
    }

    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update job by ID with mapping for content and image fields
export const updateJob = async (req, res) => {
  try {
    const { content, image, author, ...otherFields } = req.body;

    const updateData = { ...otherFields };
    if (content !== undefined) updateData.description = content;
    if (image !== undefined) updateData.jobImage = image;

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    console.log("Job updated:", job);
    res.json(job);
  } catch (err) {
    console.error("Job update error:", err);
    res.status(500).send("Server Error");
  }
};

// Get all jobs sorted by latest
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).send("Server Error");
  }
};

// Get a job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Get job error:", err);
    res.status(500).send("Server Error");
  }
};

// Delete a job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).send("Server Error");
  }
};

// Register interest in a job and notify the job author with redirect link
export const registerInterest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.id;

    const alreadyInterested = await UserInterest.findOne({ userId, jobId });
    if (alreadyInterested) {
      return res.status(409).json({ message: "Already interested" });
    }

    const interest = new UserInterest({ userId, jobId });
    await interest.save();

    const job = await Job.findById(jobId);
    if (job && job.author) {
      const notification = await createNotification({
        userId: job.author,
        type: "interest",
        fromUserId: userId,
        jobId,
        message: `Someone showed interest in your job: "${job.title}"`,
        link: `/jobs/${job._id}`, // Redirect link to job details
      });

      emitNotificationToUser(job.author.toString(), notification);
      console.log(`Interest notification sent to job author ${job.author}`);
    }

    res.status(201).json({ message: "Interest registered" });
  } catch (err) {
    console.error("Interest registration error:", err);
    res.status(500).json({ message: "Server error registering interest" });
  }
};

// Check if current user has registered interest in the job
export const checkInterest = async (req, res) => {
  try {
    const { userId } = req.user;
    const jobId = req.params.id;

    const interest = await UserInterest.findOne({ userId, jobId });
    res.json({ interested: !!interest });
  } catch (err) {
    console.error("Check interest error:", err);
    res.status(500).json({ message: "Server error checking interest" });
  }
};
