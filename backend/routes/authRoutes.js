import express from "express";
import { registerUser, loginUser } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkAuth } from "../controller/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// Add this route to support frontend auth check

router.get("/check", authMiddleware, checkAuth);


export default router;
