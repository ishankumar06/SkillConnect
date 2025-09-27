import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import { useJob } from "../context/JobContext";
import { useUsers } from "../context/UsersContext";

export default function JobSearch() {
  const { jobs, fetchJobs } = useJob();
  const { allUsers } = useUsers();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []); // eslint-disable-line

  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (!query.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    const lowered = query.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        (job.title && job.title.toLowerCase().includes(lowered)) ||
        (job.author && typeof job.author === "string" && job.author.toLowerCase().includes(lowered)) ||
        (job.company && job.company.toLowerCase().includes(lowered)) ||
        (job.address && job.address.toLowerCase().includes(lowered)) ||
        (job.location && job.location.toLowerCase().includes(lowered))
    );
    setFilteredJobs(filtered);
  };

  // Demo fallback images
  const demoProfilePic = "https://randomuser.me/api/portraits/men/75.jpg";
  const demoJobImage =
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60";
  const demoWorkplacePic =
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Search for Jobs</h2>

      <SearchBar onSearch={handleSearch} value={searchTerm} />

      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <p className="text-gray-600 text-center">No jobs found.</p>
        ) : (
          filteredJobs.map((job) => {
            // Normalize author ID as string
            const authorIdString = job.author ? String(job.author) : "";

            // Lookup full author user data (object with name and profilePic)
            const authorUser = allUsers ? allUsers[authorIdString] : null;

            // Resolve author name safely
            const authorName =
              authorUser?.fullName ||
              (typeof job.author === "string" ? job.author.trim() : "") ||
              (job.company && job.company.trim()) || // fallback company name
              "Job by Someone";
              console.log("ishananananna",authorName);
              console.log("iiiddd",job._id,job.id);
            return (
              <PostCard
                key={job._id}
                post={{
                  id:  job._id,
                  authorId: authorUser?._id || job.authorId || authorIdString,
                  author: authorName,
                  title: job.title || "Untitled Job",
                  content:
                    `Job Type: ${job.workType || job.type || "Unspecified"}` +
                    (job.address || job.location
                      ? ` | Location: ${job.address || job.location}`
                      : ""),
                  profilePic: authorUser?.profilePic || demoProfilePic,
                  jobImage: job.jobImage || job.image || demoJobImage,
                  workplacePic: demoWorkplacePic,
                  address: job.address || job.location || "",
                  salary: job.salary || "",
                  workingHour: job.workingHour || "",
                  holiday: job.holiday || "",
                  time: job.time || "",
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
