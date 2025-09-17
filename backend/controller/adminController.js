// controllers/adminController.js

import User from "../models/userModel.js";
import Job from "../models/jobModel.js";
import Application from "../models/applicationModel.js";

// Get admin dashboard data (example aggregates)
export const getDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();

    res.json({
      users: userCount,
      jobs: jobCount,
      applications: applicationCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role by ID
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["jobseeker", "employer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User role updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Block or unblock a user by ID (optional: add a boolean 'blocked' field in User model)
export const toggleUserBlockStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    res.json({ message: `User ${user.blocked ? "blocked" : "unblocked"}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Example: Remove a job post by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Additional admin functions can be added similarly

