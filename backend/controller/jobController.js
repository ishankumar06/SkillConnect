import Job from "../models/jobModel.js";

// Create a job
export const createJob = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: missing user" });
    }

    // Destructure and remove author from req.body if present
    const { author, content, image, ...otherFields } = req.body;

    // Map frontend fields 'content' and 'image' to backend schema fields
    const jobData = {
      ...otherFields,
      author: req.user.userId,
      description: content || "", // map content to description
      jobImage: image || "",      // map image to jobImage
    };

    console.log("jobData after author override and field mapping:", jobData);

    const job = new Job(jobData);
    await job.save();

    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update job by ID
export const updateJob = async (req, res) => {
  try {
    const { content, image, author, ...otherFields } = req.body;

    // Prepare updated fields with mapping for content and image
    const updateData = {
      ...otherFields,
    };

    if (content !== undefined) updateData.description = content;
    if (image !== undefined) updateData.jobImage = image;

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });
   console.log(job)
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};




// Get all jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};



// Delete job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// POST /jobs/:id/interest
export const registerInterest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.params.id;

    // Example: store interest in a separate collection or update job document
    // Here assuming a UserInterest collection schema { userId, jobId }
    const alreadyInterested = await UserInterest.findOne({ userId, jobId });
    if (alreadyInterested) {
      return res.status(409).json({ message: "Already interested" });
    }

    const interest = new UserInterest({ userId, jobId });
    await interest.save();

    res.status(201).json({ message: "Interest registered" });
  } catch (err) {
    console.error("Interest registration error:", err);
    res.status(500).json({ message: "Server error registering interest" });
  }
};

// Optional: GET /jobs/:id/is-interested to check interest status by current user
export const checkInterest = async (req, res) => {
  try {
    const { userId } = req.user;
    const jobId = req.params.id;

    const interest = await UserInterest.findOne({ userId, jobId });
    res.json({ interested: !!interest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error checking interest" });
  }
};

