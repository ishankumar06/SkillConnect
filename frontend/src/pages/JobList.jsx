import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useJob } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";
import bgImage from '../assets/bgImage.png';

export default function JobList() {
  const navigate = useNavigate();
  const { userId } = useAuth(); // current logged in user ID
  const { jobs, removeJob, updateJob } = useJob();

  const [editingJobId, setEditingJobId] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(new Set()); // Track followed users
  const [editForm, setEditForm] = useState({
    author: "",
    title: "",
    content: "",
    address: "",
    workType: "",
    salary: "",
    workingHour: "",
    holiday: "",
    type: "",
    image: "",
    time: "",
    likes: 0,
    interested: 0,
    shares: 0,
  });

  const fileInputRef = useRef();

  // Filter jobs to only those posted by current user
  const userJobs = jobs.filter(
    (job) => String(job.authorId || job.author) === String(userId)
  );

  // Follow/Unfollow functionality
  const handleFollowToggle = async (authorId) => {
    // Don't allow following yourself
    if (String(authorId) === String(userId)) {
      return;
    }

    try {
      const isCurrentlyFollowing = followingUsers.has(authorId);
      
      // Here you would typically make an API call to follow/unfollow
      // For now, we'll just update local state
      const newFollowingUsers = new Set(followingUsers);
      
      if (isCurrentlyFollowing) {
        newFollowingUsers.delete(authorId);
        // API call: await unfollowUser(authorId);
      } else {
        newFollowingUsers.add(authorId);
        // API call: await followUser(authorId);
      }
      
      setFollowingUsers(newFollowingUsers);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  // Check if current user is following a specific user
  const isFollowing = (authorId) => {
    return followingUsers.has(authorId);
  };

  // Check if the author is the current user
  const isCurrentUser = (authorId) => {
    return String(authorId || '') === String(userId);
  };

  // Start editing
  const startEditing = (job) => {
    setEditingJobId(job._id);
    setEditForm({
      author: job.author || "",
      title: job.title || "",
      content: job.content || "",
      address: job.address || "",
      workType: job.workType || "",
      salary: job.salary || "",
      workingHour: job.workingHour || "",
      holiday: job.holiday || "",
      type: job.type || "",
      image: job.image || "",
      time: job.time || "",
      likes: job.likes || 0,
      interested: job.interested || 0,
      shares: job.shares || 0,
    });
  };

  const cancelEditing = () => {
    setEditingJobId(null);
    setEditForm({
      author: "",
      title: "",
      content: "",
      address: "",
      workType: "",
      salary: "",
      workingHour: "",
      holiday: "",
      type: "",
      image: "",
      time: "",
      likes: 0,
      interested: 0,
      shares: 0,
    });
  };

  // Save edited job
  const saveEdit = (id) => {
    if (!editForm.title.trim() || !editForm.author.trim()) {
      alert("Job Title and Company/Author are required");
      return;
    }
    updateJob(id, {
      ...editForm,
      author: editForm.author.trim() || "Company",
      title: editForm.title.trim() || "Job Title",
    });
    cancelEditing();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // File input handler for image upload (optional)
  const onImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setEditForm((prev) => ({ ...prev, image: base64 }));
    }
  };

  // Follow Button Component
  const FollowButton = ({ authorId, className = "" }) => {
    const isOwnProfile = isCurrentUser(authorId);
    const following = isFollowing(authorId);

    return (
      <Button
        onClick={() => handleFollowToggle(authorId)}
        disabled={isOwnProfile}
        className={`
          ${isOwnProfile 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : following 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } 
          ${className}
        `}
      >
        {isOwnProfile 
          ? 'You' 
          : following 
            ? 'Unfollow' 
            : 'Follow'
        }
      </Button>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 space-y-6"
    style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      >
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Jobs You Posted</h2>

      {userJobs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No jobs posted yet.</p>
      ) : (
        <div className="space-y-4">
          {userJobs.map((job) => (
            <Card
              key={job._id}
              className="p-6 flex flex-col gap-4 shadow-md rounded-xl bg-white"
            >
              {editingJobId === job._id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEdit(job._id);
                  }}
                >
                  {/* Hidden file input for image upload */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    {/* Job Title */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Job Title</span>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                        required
                      />
                    </label>

                    {/* Company/Author */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Company</span>
                      <input
                        type="text"
                        name="author"
                        value={editForm.author}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                        required
                      />
                    </label>

                    {/* Content */}
                    <label className="flex flex-col col-span-2">
                      <span className="font-semibold mb-1">Job Description</span>
                      <textarea
                        name="content"
                        value={editForm.content}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2 min-h-20"
                        rows="3"
                      />
                    </label>

                    {/* Address */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Location</span>
                      <input
                        type="text"
                        name="address"
                        value={editForm.address}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                      />
                    </label>

                    {/* Work Type */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Work Type</span>
                      <select
                        name="workType"
                        value={editForm.workType}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                      >
                        <option value="">Select Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </label>

                    {/* Salary */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Salary</span>
                      <input
                        type="text"
                        name="salary"
                        value={editForm.salary}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                        placeholder="e.g., $50,000 - $70,000"
                      />
                    </label>

                    {/* Working Hours */}
                    <label className="flex flex-col">
                      <span className="font-semibold mb-1">Working Hours</span>
                      <input
                        type="text"
                        name="workingHour"
                        value={editForm.workingHour}
                        onChange={handleEditChange}
                        className="border rounded px-3 py-2"
                        placeholder="e.g., 9 AM - 5 PM"
                      />
                    </label>

                    {/* Image upload and preview */}
                    <label className="flex flex-col col-span-2">
                      <span className="font-semibold mb-1">Image</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="mb-2 px-3 py-1 rounded border border-gray-400 hover:bg-gray-100 transition self-start"
                      >
                        Choose Image
                      </button>
                      {editForm.image ? (
                        <img
                          src={editForm.image}
                          alt="Job"
                          className="max-h-36 rounded object-cover"
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">No image selected</p>
                      )}
                    </label>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button type="submit" className="bg-green-500/30 hover:bg-green-700/30">
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-400 hover:bg-gray-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-blue-700">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-600">{job.author || "Company"}</p>
                        <FollowButton authorId={job.authorId || job.author} />
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {job.type || job.workType}
                    </span>
                  </div>
                  
                  {job.address && <p className="text-gray-400 text-sm">{job.address}</p>}
                  <p className="text-sm text-gray-500 mb-1">{job.content}</p>
                  
                  {job.image && (
                    <img 
                      src={job.image} 
                      alt="Job" 
                      className="max-h-48 rounded object-cover"
                    />
                  )}

                  <div className="flex gap-3 mt-3">
                    <Button
                      onClick={() => navigate(`/applicants/${job._id}`)}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View Applicants
                    </Button>
                    <Button
                      onClick={() => startEditing(job)}
                      className="bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this job?")) {
                          removeJob(job._id);
                        }
                      }}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}