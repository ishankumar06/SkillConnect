import SavedPost from "../models/savedPostModel.js";

// Get all saved posts for logged-in user, populated with full job and author details
export const fetchSavedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPost.find({ user: req.user.userId })
      .populate({
        path: "postId",
        // Removed select to include all job post fields
        populate: {
          path: "author",
          select: "name profilePic", // select only necessary author fields
        },
      })
      .exec();

    console.log("Fetched saved posts with full job and author data:", savedPosts);
    res.json(savedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Server error fetching saved posts" });
  }
};


// Add a saved post for logged-in user, preventing duplicates
export const addSavedPost = async (req, res) => {
  try {
    console.log("Received addSavedPost request body:", req.body);
    const userId = req.user.userId;
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "postId required" });

    // Check if already saved
    const exists = await SavedPost.findOne({ user: userId, postId });
    if (exists) {
      return res.status(409).json({ message: "Post already saved" }); // 409 Conflict
    }

    const newSavedPost = new SavedPost({ user: userId, postId });
    await newSavedPost.save();

    res.status(201).json(newSavedPost);
  } catch (error) {
    console.error("Error adding saved post:", error);
    res.status(500).json({ message: "Server error adding saved post" });
  }
};


// Remove a saved post by its ID for logged-in user
export const removeSavedPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const savedPostId = req.params.id;
    console.log("Removing savedPostId:", savedPostId);

    const savedPost = await SavedPost.findOne({ _id: savedPostId, user: userId });
    if (!savedPost) return res.status(404).json({ message: "Saved post not found" });

    await SavedPost.deleteOne({ _id: savedPostId });
    res.json({ message: "Saved post removed" });
  } catch (error) {
    console.error("Error removing saved post:", error);
    res.status(500).json({ message: "Server error removing saved post" });
  }
};

// Clear all saved posts for logged-in user
export const clearSavedPosts = async (req, res) => {
  try {
    const userId = req.user.userId;
    await SavedPost.deleteMany({ user: userId });
    res.json({ message: "All saved posts cleared" });
  } catch (error) {
    console.error("Error clearing saved posts:", error);
    res.status(500).json({ message: "Server error clearing saved posts" });
  }
};
