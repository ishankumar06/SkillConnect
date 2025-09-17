import express from "express";
import * as userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/profile", authMiddleware, userController.getCurrentUserProfile);
router.get("/:id", authMiddleware, userController.getUserProfile);
router.put("/:id", authMiddleware, userController.updateUser);

export default router;