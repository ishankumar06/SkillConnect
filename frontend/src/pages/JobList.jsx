import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useJob } from "../context/JobContext";
import { useAuth } from "../context/AuthContext";
import bgImage from '../assets/bgImage.png';

const icon = (
  <span className="flex items-center justify-center w-12 h-12 bg-black-100 rounded-xl shadow-sm">
    <i className="fas fa-briefcase text-2xl text-black-500" />
  </span>
);

export default function JobList() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { jobs, removeJob, updateJob } = useJob();

  const [editingJobId, setEditingJobId] = useState(null);
  const [editForm, setEditForm] = useState({
    author: "", title: "", content: "", address: "",
    workType: "", salary: "", workingHour: "", holiday: "",
    type: "", image: "", time: "", likes: 0, interested: 0, shares: 0,
  });
  const fileInputRef = useRef();

  const userJobs = jobs.filter(
    (job) => String(job.authorId || job.author) === String(userId)
  );

  return (
    <div
      className="w-full min-h-screen flex flex-col gap-8 p-8 bg-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-2xl font-extrabold text-white mb-4">Jobs You Posted</h2>

      {userJobs.length === 0 ? (
        <p className="text-white text-center mt-10">No jobs posted yet.</p>
      ) : (
        <div className="space-y-6">
          {userJobs.map((job) => (
            <div
              key={job._id}
              className={`flex items-center gap-5 px-8 py-6 rounded-2xl border-l-8 border-black-300  bg-[#403d41]
                transition-all duration-200
                hover:shadow-lg`}
              style={{
                boxShadow: "0 6px 24px 0 #e4ebfd",
              }}
            >
              {icon}
              <div className="flex-1 min-w-0">
                {/* Job Title & Company */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-black-900 truncate">{job.title}</div>
                    <div className="text-sm text-white">{job.author}</div>
                  </div>
                  <span className="bg-black-50 text-black-500 text-xs font-semibold px-3 py-1 rounded-full ml-4">
                    {job.type || job.workType}
                  </span>
                </div>

                {job.address && <div className="mt-1 text-xs text-white">{job.address}</div>}
                <div className="text-white text-sm mt-2">{job.content}</div>

                {job.image && (
                  <img
                    src={job.image}
                    alt="Job"
                    className="rounded-lg max-h-40 mt-2 object-cover border border-gray-100"
                  />
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => navigate(`/applicants/${job._id}`)}
                    className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
                  >
                    View Applicants
                  </Button>
                  <Button
                    onClick={() => setEditingJobId(job._id)}
                    className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
                  >
                    Update
                  </Button>
                 <Button
    onClick={() => {
      if (window.confirm("Are you sure you want to delete this job?")) {
        removeJob(job._id);
      }
    }}
    className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
  >
    Delete
  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
