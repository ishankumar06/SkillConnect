import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controller/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // default export middleware

const router = express.Router();

// Protect all routes below using authMiddleware
router.use(authMiddleware);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification); 

export default router;
