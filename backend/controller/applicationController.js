import mongoose from "mongoose";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import { createNotification } from "../config/createNotification.js"; // Adjust path as necessary
import { emitNotificationToUser } from "../server.js"; // Import the socket notification emitter

// Get all applications for the logged-in user
export const getAllApplications = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(400).json({ message: "User ID missing from request" });
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user.userId);

    const applications = await Application.find({ applicantId: userObjectId }).populate("jobId");

    console.log("Applications found:", applications);

    return res.json(applications);
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

export const applyToJob = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  try {
    let { jobId, name, about, skills } = req.body;
    const applicantId = req.user.userId || req.user._id;
    const resumeUrl = req.file?.path;

    if (!jobId || !applicantId || !name?.trim() || !about?.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingApp = await Application.findOne({ jobId, applicantId });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = new Application({
      jobId: jobId.trim(),
      applicantId,
      name: name.trim(),
      resumeUrl: resumeUrl || "",
      about: about.trim(),
      skills: skills,
      status: "pending",
    });

    await application.save();

    const job = await Job.findById(jobId);
    if (job && job.author) {
      const notification = await createNotification({
        userId: job.author,
        type: "jobApplication",
        fromUserId: applicantId,
        jobId,
        message: `New application from ${name} on your job post "${job.title}"`,
        link: `/jobs/${application._id}`,            // Add link pointing to job details page
        // Or if you want to go directly to application details:
        // link: `/applications/${application._id}`
      });

      emitNotificationToUser(job.author.toString(), notification);
    }

    return res.status(201).json(application);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error applying for job" });
  }
};

// Get applications by job ID
export const getApplicationsByJob = async (req, res) => {
  const { jobId } = req.params;
  console.log("Received jobId:", jobId);

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  try {
    const applications = await Application.find({ jobId })
      .populate("jobId")          // populate job information
      .populate("applicantId");   // populate applicant user info

    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).send("Server Error");
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
