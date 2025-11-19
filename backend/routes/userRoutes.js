import express from "express";
import * as userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfile } from '../controller/userController.js';
import { checkAuth } from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes requiring authentication
router.get("/", authMiddleware, userController.getAllUsers);



// Get currently logged-in user's profile
router.get("/profile", authMiddleware, userController.getCurrentUserProfile);



// Update logged-in user's profile
router.put("/update-profile", authMiddleware, updateProfile);



// Check authentication status
router.get("/check", authMiddleware, checkAuth);



// Update a user by ID (admin or same user)
router.put("/:id", authMiddleware, userController.updateUser);



// Get any user by ID - public route for author profile fetching,
// possible to add authMiddleware if you want to restrict access
router.get("/author/:id", userController.getUserById);

export default router;
