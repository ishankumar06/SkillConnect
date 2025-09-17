import express from "express";
import {
  fetchSavedPosts,
  addSavedPost,
  removeSavedPost,
  clearSavedPosts,
} from "../controller/savedPostsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all saved posts routes

router.get("/", fetchSavedPosts);
router.post("/", addSavedPost);
router.delete("/:id", removeSavedPost);
router.delete("/", clearSavedPosts);

export default router;
