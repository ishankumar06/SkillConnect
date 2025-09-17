import express from "express";
import * as applicationController from "../controller/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Configure Multer storage (example: local disk)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Apply to a job - protected route with file upload middleware
router.post("/apply", authMiddleware, upload.single("resume"), applicationController.applyToJob);

// Get applications for a job - can be public or protected
router.get("/job/:jobId",authMiddleware, applicationController.getApplicationsByJob);

// Update application status - protected
router.put("/:id/status", authMiddleware,authorizeRoles("employer"), applicationController.updateApplicationStatus);

// Get all applications for the authenticated user

router.get("/", authMiddleware, applicationController.getAllApplications);


export default router;
