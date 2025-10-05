import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJob } from "../context/JobContext";
import { useApplication } from "../context/ApplicationContext";
import Card from "../components/ui/Card";
import bgImage from '../assets/bgImage.png';

export default function Applied() {
  // Get the complete list of jobs from JobContext
  const { jobs, fetchJobs } = useJob();
  // Get all applied job records from ApplicationContext
  const { applications } = useApplication();

  const [appliedJobDetails, setAppliedJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all jobs on first mount
  useEffect(() => {
    fetchJobs();
  }, []); // Run once on mount

  // When jobs or applications update, merge application info with job details
  useEffect(() => {
    console.log("DEBUG: applications from context:", applications);
    console.log("DEBUG: jobs from context:", jobs);

    if (!jobs.length) return;

    // Normalize IDs to string for comparison
    const merged = applications
      .map(({ jobId, status, appliedAt }) => {
        // Extract string jobId (handle populated or raw)
        const appJobId = typeof jobId === "object" && jobId?._id ? jobId._id : jobId;

        console.log("DEBUG: Checking jobId", appJobId);

        // Find matching job by id or _id cast to string
        const job = jobs.find(
          (j) => String(j.id || j._id) === String(appJobId)
        );

        if (!job) {
          console.log("DEBUG: Job not found for jobId:", appJobId);
          return null;
        }
        return {
          ...job,
          status,
          appliedAt,
          company: job.company || job.author || "Unknown Company",
          location: job.location || job.address || "Unknown Location",
        };
      })
      .filter(Boolean);

    console.log("DEBUG: merged appliedJobDetails:", merged);

    setAppliedJobDetails(merged);
    setLoading(false);
  }, [applications, jobs]);

  if (loading) return <div>Loading...</div>;

  if (appliedJobDetails.length === 0)
    return (
      <div className="text-center mt-20 font-medium text-gray-500">
        You have not applied to any jobs yet.
        <br />
        <span className="text-xs text-gray-400">(Check developer console for debug logs)</span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Applied Jobs</h1>
      {appliedJobDetails.map(({ id, _id, title, status, appliedAt, company, location }) => (
        <Card key={id || _id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                status.toLowerCase() === "accepted"
                  ? "bg-green-100 text-green-800"
                  : status.toLowerCase() === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-gray-700 mb-1">{company}</p>
          <p className="text-gray-500 mb-1">{location}</p>
          <p className="text-sm text-gray-400">Applied on: {new Date(appliedAt).toLocaleDateString()}</p>
          <button
            className="mt-3 text-blue-600 hover:underline"
            onClick={() => navigate(`/job/${id || _id}`)}
          >
            View Job Details
          </button>
        </Card>
      ))}
    </div>
  );
}

