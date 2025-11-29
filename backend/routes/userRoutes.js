import express from "express";
import * as userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfile } from "../controller/userController.js";
import { checkAuth } from "../controller/userController.js";
import User from "../models/userModel.js";

const router = express.Router();

// Public routes
router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);


router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.userId;

    const filter = search
      ? {
          fullName: { $regex: search, $options: "i" },
          _id: { $ne: userId },
        }
      : { _id: { $ne: userId } };

    const users = await User.find(filter).select("-password").limit(20);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get currently logged-in user's profile
router.get("/profile", authMiddleware, userController.getCurrentUserProfile);

// Update logged-in user's profile
router.put("/update-profile", authMiddleware, updateProfile);

// Check authentication status
router.get("/check", authMiddleware, checkAuth);

// Update a user by ID
router.put("/:id", authMiddleware, userController.updateUser);

// Get any user by ID
router.get("/author/:id", userController.getUserById);

export default router;
