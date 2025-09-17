import express from "express";
import * as jobController from "../controller/jobController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create new job - protected route
router.post("/", authMiddleware, jobController.createJob);

// Get all jobs - public
router.get("/", jobController.getJobs);

// Get job by ID - public
router.get("/:id", jobController.getJobById);

// Update job by ID - only accessible to authenticated employers
router.put("/:id", authMiddleware, jobController.updateJob);

// Delete job by ID - only accessible to authenticated employers
router.delete("/:id", authMiddleware, jobController.deleteJob);

// Register interest for a job - protected route
router.post("/:id/interest", authMiddleware, jobController.registerInterest);

// Check if current user is interested in a job - protected route
router.get("/:id/is-interested", authMiddleware, jobController.checkInterest);

export default router;
