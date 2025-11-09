// SavedPostsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { toast } from "react-hot-toast";


const SavedPostsContext = createContext();

export function SavedPostsProvider({ children }) {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const savedResponse = await api.get("/saved-posts");
      const savedPostsData = savedResponse.data;

      savedPostsData.forEach((savedPost, i) => {
        console.log(`jobImage of saved post ${i}:`, savedPost.postId?.jobImage);
      });

      setSavedPosts(savedPostsData);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to load saved posts";
      setError(message);
      console.error("Fetch saved posts error:", err.response || err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);
 // Make sure react-toastify is installed and imported

const addSavedPost = useCallback(
  async (post) => {
    if (!post || !(post._id || post.id)) {
      console.error("Invalid post object passed to addSavedPost:", post);
      toast.error("Invalid post, cannot save");
      return;
    }
    const postId = post._id || post.id;
    console.log("Saving post with id:", postId);
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/saved-posts", { postId });
      console.log("Save post response:", response.data);
      await fetchSavedPosts();
      toast.success("Post saved successfully");
    } catch (err) {
      if (err.response?.status === 409) {
        // 409 Conflict means post already saved
        console.log("post already saved");
      } else {
        const message = err.response?.data?.message || "Failed to save post";
        setError(message);
        toast.error(message);
        console.error("Save post failed:", err.response || err.message || err);
      }
    } finally {
      setLoading(false);
    }
  },
  [fetchSavedPosts]
);


  const removeSavedPost = useCallback(
    async (savedPostId) => {
      if (!savedPostId) {
        console.error("No savedPostId provided to removeSavedPost");
        setError("Invalid post id");
        return;
      }
      console.log("Removing saved post with id:", savedPostId);
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/saved-posts/${savedPostId}`);
        console.log("Removed saved post:", savedPostId);
        await fetchSavedPosts();
      } catch (err) {
        const message = err.response?.data?.message || "Failed to remove saved post";
        setError(message);
        console.error("Remove saved post failed:", err.response || err.message || err);
      } finally {
        setLoading(false);
      }
    },
    [fetchSavedPosts]
  );

  const clearSavedPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/saved-posts`);
      console.log("Cleared all saved posts");
      setSavedPosts([]);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear saved posts";
      setError(message);
      console.error("Clear saved posts failed:", err.response || err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  return (
    <SavedPostsContext.Provider
      value={{
        savedPosts,
        loading,
        error,
        addSavedPost,
        removeSavedPost,
        clearSavedPosts,
        fetchSavedPosts,
      }}
    >
      {children}
    </SavedPostsContext.Provider>
  );
}

export function useSavedPosts() {
  const context = useContext(SavedPostsContext);
  if (!context) {
    throw new Error("useSavedPosts must be used within a SavedPostsProvider");
  }
  return context;
}
