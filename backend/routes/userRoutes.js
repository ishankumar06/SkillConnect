import express from "express";
import * as userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfile } from '../controller/userController.js';
import { checkAuth } from "../controller/userController.js";





const router = express.Router();

router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/", authMiddleware, userController.getAllUsers);
router.get("/profile", authMiddleware, userController.getCurrentUserProfile);
router.get("/:id", authMiddleware, userController.getUserProfile);
router.put("/:id", authMiddleware, userController.updateUser);

//ishan 

router.put("/update-profile", authMiddleware, updateProfile);
router.get("/check", authMiddleware, checkAuth);

export default router;