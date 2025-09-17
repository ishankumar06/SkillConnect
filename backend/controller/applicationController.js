// import Application from "../models/applicationModel.js";

// // Apply to a job (create application)


// export const getAllApplications = async (req, res) => {
//   try {
//     // Assuming applications have a field 'applicant' referencing user ID
//     const applications = await Application.find({ applicant: req.user._id }).populate("job");
//     res.json(applications);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// export const applyToJob = async (req, res) => {
//   try {
//     const { jobId, name, about, skills } = req.body;
//     const applicantId = req.user.userId || req.user._id;
//     const resumeUrl = req.file?.path;

//     if (!jobId || !applicantId || !name || !about || !resumeUrl) {
//       return res.status(400).json({ message: "Missing required fields or resume file" });
//     }

//     const existingApp = await Application.findOne({ jobId, applicantId });
//     if (existingApp) {
//       return res.status(400).json({ message: "Already applied to this job" });
//     }

//     const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);

//     const application = new Application({
//       jobId,
//       applicantId,
//       name,
//       resumeUrl,
//       about,
//       skills: skillsArray,
//       status: "pending",
//     });

//     await application.save();
//     res.status(201).json(application);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error applying for job" });
//   }
// };

// // const applyToJob = async (req, res) => {
// //   try {
// //     const { jobId, name, about, skills } = req.body;
// //     const applicantId = req.user.userId || req.user._id;
// //     const resumeUrl = req.file?.path;

// //     if (!jobId || !applicantId || !name || !about || !resumeUrl) {
// //       return res.status(400).json({ message: "Missing required fields or resume" });
// //     }

// //     // Create application
// //     const application = new Application({
// //       jobId: mongoose.Types.ObjectId(jobId),
// //       applicantId: mongoose.Types.ObjectId(applicantId),
// //       name,
// //       resumeUrl,
// //       about,
// //       skills,
// //       status: "pending",
// //     });

// //     await application.save();
// //     res.status(201).json(application);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error applying for job" });
// //   }
// // };


// // Get applications by job ID
// export const getApplicationsByJob = async (req, res) => {
//   try {
//     const applications = await Application.find({ jobId: req.params.jobId });
//     res.json(applications);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };

// // Update application status
// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     if (!application)
//       return res.status(404).json({ message: "Application not found" });

//     res.json(application);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };



import mongoose from "mongoose";

import Application from "../models/applicationModel.js";


// Get all applications for the logged-in user
export const getAllApplications = async (req, res) => {
  try {
    // Validate userId presence
    if (!req.user?.userId) {
      return res.status(400).json({ message: "User ID missing from request" });
    }

    // Convert userId string to mongoose ObjectId safely
  const userObjectId = new mongoose.Types.ObjectId(req.user.userId);


    // Find applications where applicantId matches the user ID and populate job details
    const applications = await Application.find({ applicantId: userObjectId }).populate("jobId");

    console.log("Applications found:", applications);

    // Send back application data
    return res.json(applications);
  } catch (error) {
    console.error("Error in getAllApplications:", error);

    // Handle invalid ObjectId error explicitly
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

// Apply to a job (create application)
export const applyToJob = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  try {
    let { jobId, name, about, skills } = req.body;

    // Use user ID from token only for security
    const applicantId = req.user.userId || req.user._id;
    const resumeUrl = req.file?.path;

    // Validate required fields including optional resume check
    if (
      !jobId ||
      !applicantId ||
      !name?.trim() ||
      !about?.trim() /* || !resumeUrl */ // Uncomment if resume required
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if already applied to this job by this applicant
    const existingApp = await Application.findOne({ jobId, applicantId });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // Normalize skills as an array of trimmed strings
    // let skillsArray = [];
    // if (Array.isArray(skills)) {
    //   skillsArray = skills.map(s => s.trim()).filter(Boolean);
    // } else if (typeof skills === "string") {
    //   skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);
    // }

    // Create new application document
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

    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error applying for job" });
  }
};

// Get applications by job ID
// export const getApplicationsByJob = async (req, res) => {
//   try {
//     const applications = await Application.find({ jobId: req.params.jobId });
//     console.log("ishan",jobId);
//     res.json(applications);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// };
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
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
