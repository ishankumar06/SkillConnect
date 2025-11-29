import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJob } from "../context/JobContext";
import { useApplication } from "../context/ApplicationContext";
import bgImage from "../assets/bgImage.png";
import { Info } from "lucide-react";

export default function Applied() {
  const { jobs, fetchJobs } = useJob();
  const { applications } = useApplication();
  const [appliedJobDetails, setAppliedJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!jobs.length) return;

    const merged = applications
      .map(({ jobId, status, appliedAt }) => {
        const appJobId =
          typeof jobId === "object" && jobId?._id ? jobId._id : jobId;

        const job = jobs.find(
          (j) => String(j.id || j._id) === String(appJobId)
        );

        if (!job) return null;

        return {
          ...job,
          status,
          appliedAt,
          company: job.company || job.author || "Unknown Company",
          location: job.location || job.address || "Unknown Location",
        };
      })
      .filter(Boolean);

    setAppliedJobDetails(merged);
    setLoading(false);
  }, [applications, jobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 text-lg animate-pulse">
        Loading applied jobs...
      </div>
    );
  }

  if (appliedJobDetails.length === 0) {
    return (
      <div
        className="w-full min-h-screen flex flex-col justify-center items-center text-gray-500 text-center p-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-3xl font-bold mb-4">Applied Jobs</h2>
        <p>You haven’t applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col gap-8 p-8"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-2xl font-extrabold text-black-800 mb-4">
        Jobs You Applied To
      </h2>

      {appliedJobDetails.map((job) => (
        <div
          key={job._id || job.id}
          className={`flex items-center gap-5 px-8 py-6 rounded-2xl border-l-8 border-black-300 shadow-md bg-[#403d41]
            transition-all duration-200 hover:shadow-lg`}
          style={{
            boxShadow: "0 6px 24px 0 #e4ebfd",
          }}
        >
          <span className="flex items-center justify-center w-12 h-12 bg-black-100 rounded-xl shadow-sm">
            <i className="fas fa-briefcase text-2xl text-black-500" />
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-lg text-black-900 truncate">
                  {job.title}
                </div>
                <div className="text-sm text-white">{job.company}</div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  job.status.toLowerCase() === "accepted"
                    ? "bg-green-100 text-green-800"
                    : job.status.toLowerCase() === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.status}
              </span>
            </div>

            <div className="mt-1 text-xs text-white">{job.location}</div>
            <div className="text-white text-sm mt-2 line-clamp-2">
              {job.content || job.description || "No description available."}
            </div>

            {job.image && (
              <img
                src={job.image}
                alt="Job"
                className="rounded-lg max-h-40 mt-2 object-cover border border-gray-100"
              />
            )}

            <p className="text-xs text-white mt-2">
              Applied on: {new Date(job.appliedAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => navigate(`/job/${job._id || job.id}`)}
                className="flex items-center gap-1 text-yellow-600 font-medium border border-yellow-200 px-4 py-1.5 rounded-xl hover:bg-yellow-50 hover:border-yellow-500 transition"
              >
                <Info size={16} />
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
