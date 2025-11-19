import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useJob } from "@/context/JobContext";
import PostCard from "../components/PostCard";
import { fetchAuthorById } from "../api/authors";

export default function JobDetail() {
  const { id } = useParams();
  const { jobs, fetchJobs } = useJob();
  const [job, setJob] = useState(null);
  const [author, setAuthor] = useState(null);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorError, setAuthorError] = useState(null);

  const demoProfilePic = "https://randomuser.me/api/portraits/men/75.jpg";
  const demoJobImage =
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80";
  const demoWorkplacePic =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60";

  // Fetch jobs if not loaded
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      fetchJobs();
    }
  }, [jobs, fetchJobs]);

  // Find the job by id
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const found = jobs.find((j) => j._id === id || j.id === id);
      setJob(found || null);
    }
  }, [id, jobs]);

  // Fetch author details when job changes
useEffect(() => {
  async function loadAuthor() {
    if (job?.author) {
      setAuthorLoading(true);
      setAuthorError(null);
      try {
        console.log("Fetching author for job.author ID:", job.author);
        const authorData = await fetchAuthorById(job.author);
        setAuthor(authorData);
        console.log("Fetched author data:", authorData);
      } catch (error) {
        console.error("Error fetching author:", error);
        setAuthorError("Failed to load author information");
        setAuthor(null);
      }
      setAuthorLoading(false);
    } else {
      setAuthor(null);
    }
  }
  loadAuthor();
}, [job]);


  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Loading job details...</p>
      </div>
    );
  }

  const normalizedJob = {
    id: job._id || job.id,
    authorId: job.authorId || job.author || "unknown",
    author: {
      fullName: author?.fullName || job.company || job.companyName || job.employer || "Unknown Company",
      profilePic: author?.profilePic || job.profilePic || demoProfilePic,
    },
    title: job.title || "Untitled Job",
    content: `Job Type: ${job.workType || job.type || "Unspecified"}${
      job.address || job.location ? ` | Location: ${job.address || job.location}` : ""
    }`,
    jobImage: job.jobImage || job.image || demoJobImage,
    workplacePic: demoWorkplacePic,
    address: job.address || job.location || "Not specified",
    salary: job.salary || "",
    workingHour: job.workingHour || "",
    holiday: job.holiday || "",
    time: job.time || "",
    description:
      job.description ||
      "We are looking for a talented individual to join our team. This is a great opportunity to work on exciting projects in a dynamic environment.",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div
        className="w-full h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${normalizedJob.jobImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{normalizedJob.title}</h1>
          <p className="text-lg text-gray-200">{normalizedJob.address || "Location not specified"}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="max-w-7xl mx-auto py-12 px-6 grid md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About this Job</h2>
          <p className="text-gray-600 leading-relaxed mb-8">{normalizedJob.description}</p>

          <div className="border-t border-gray-200 my-6" />

          {/* PostCard (reuses same UI style as feed) */}
          <PostCard post={normalizedJob} />
        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Overview</h3>
          <ul className="space-y-4 text-gray-700">
            <li>
              <strong>Company:</strong>{" "}
              {authorLoading
                ? "Loading author..."
                : authorError
                ? authorError
                : normalizedJob.author.fullName}
            </li>
            <li>
              <strong>Location:</strong> {normalizedJob.address}
            </li>
            <li>
              <strong>Salary:</strong> {normalizedJob.salary ? `₹${normalizedJob.salary}` : "Negotiable"}
            </li>
            <li>
              <strong>Working Hours:</strong> {normalizedJob.workingHour || "Flexible"}
            </li>
            <li>
              <strong>Holiday:</strong> {normalizedJob.holiday || "As per company policy"}
            </li>
          </ul>

          <button
            onClick={() => window.history.back()}
            className="mt-8 w-full px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
