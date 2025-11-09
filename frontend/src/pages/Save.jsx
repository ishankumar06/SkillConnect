import React, { useEffect, useState } from "react";
import { useSavedPosts } from "../context/SaveContext";
import { useJob } from "../context/JobContext";
import PostCard from "../components/PostCard";
import { Trash2 } from "lucide-react";
import bgImage from "../assets/bgImage.png";

export default function Save() {
  const { savedPosts, removeSavedPost, loading, error } = useSavedPosts();
  const { jobs, fetchJobs } = useJob();

  const [job, setJob] = useState(null);

  const demoWorkplacePic =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60";
  const demoJobImage =
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";

  // Fetch jobs if none loaded
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      fetchJobs();
    }
  }, [jobs, fetchJobs]);

  const validPic = (pic) =>
    typeof pic === "string" && pic.trim() !== "" ? pic : null;

  if (loading) return <div>Loading saved posts...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (savedPosts.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        <h1 className="text-3xl font-bold mb-4">Saved Posts</h1>
        <p>You have no saved posts yet.</p>
      </div>
    );

  return (
    <div
      className="max-w-4xl mx-auto p-4 space-y-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-3xl font-bold mb-6">Saved Posts</h1>
      {savedPosts.map((savedPost) => {
        const originalPost = savedPost.postId || {};

        const post = {
          ...originalPost,
          content: originalPost.content || originalPost.description || "",
          jobImage: originalPost.jobImage || "",
          author: {
            ...originalPost.author,
            fullName:
              originalPost.author?.fullName ||
              originalPost.author?.name ||
              "Unknown Company",
            profilePic:
              validPic(originalPost.author?.profilePic) ||
              validPic(originalPost.profilePic) ||
              demoWorkplacePic,
            jobImage: job?.jobImage || job?.image || demoJobImage,
          },
        };

        return (
          <div
            key={savedPost._id}
            className="relative border rounded-lg p-4 shadow-md"
          >
            <PostCard post={post} />
            <button
              onClick={() => removeSavedPost(savedPost._id)}
              aria-label="Remove saved post"
              title="Remove Saved Post"
              disabled={loading}
              className="absolute top-2 left-1/2 transform -translate-x-1/2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition z-10 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
