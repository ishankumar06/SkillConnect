import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import * as adminController from "../controller/adminController.js";

const router = express.Router();

// Protect all admin routes with auth and admin role check
router.use(authMiddleware);
router.use(authorizeRoles("admin"));

// Example routes for admin operations:

// Get admin dashboard or stats
router.get("/dashboard", adminController.getDashboard);

// Manage users - e.g. delete user by ID
router.delete("/users/:id", adminController.deleteUser);

// Add more admin-specific routes here...

export default router;
