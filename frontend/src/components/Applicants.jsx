import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import { useJob } from "../context/JobContext";
import Button from "../components/ui/Button";
import bgImage from "../assets/bgImage.png";

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { applications, fetchApplications } = useApplication();
  const { userId } = useAuth();
  const { profile } = useUserProfile();
  const { allUsers } = useUsers();
  const { jobs, fetchJobs } = useJob();

  const [job, setJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs + applications when mounted
  useEffect(() => {
    fetchJobs?.();
    if (fetchApplications && jobId) {
      fetchApplications(jobId);
    }
  }, [fetchJobs, fetchApplications, jobId]);

  // Find job from jobs list
  useEffect(() => {
    if (!jobs || !jobId) {
      setJob(null);
      return;
    }
    const found = jobs.find((j) => {
      const candidateId = j?._id?.toString?.() || j?.id?.toString?.();
      return String(candidateId) === String(jobId);
    });
    setJob(found || null);
  }, [jobs, jobId]);

  // Filter applications that belong to this job
  useEffect(() => {
    if (!applications || !jobId) {
      setJobApplications([]);
      return;
    }

    const filtered = applications.filter((app) => {
      let appJobId = null;
      if (app.jobId) {
        if (typeof app.jobId === "string") appJobId = app.jobId;
        else if (typeof app.jobId === "object" && app.jobId._id) appJobId = app.jobId._id;
      }
      return String(appJobId)?.trim() === String(jobId)?.trim();
    });

    setJobApplications(filtered);
  }, [applications, jobId]);

  // Enrich applicant data with allUsers/user profile info
  useEffect(() => {
    if (!jobApplications || !allUsers) {
      setJobApplicants([]);
      return;
    }

    const enriched = jobApplications
      .map((app) => {
        // applicant id might be populated object or simple id
        const userIdStr = app.applicantId?._id || app.applicantId;
        const userProfile = allUsers[userIdStr];

        if (!userProfile) {
          // skip missing user data (or you could return a placeholder)
          return null;
        }

        const rawResume = app.resumeUrl || userProfile.resumeUrl || null;
        const normalizedResume = rawResume ? rawResume.replace(/\\/g, "/") : null;
        console.log("ishhhhhhh Resume URL:", normalizedResume);

        return {
          fullName: userProfile.fullName || userProfile.name || "Unnamed",
          id: userIdStr,
          email: userProfile.email || userProfile?.contact || "",
          skills: app.skills || userProfile.skills || [],
          about: app.about || userProfile.about || "",
          resumeUrl: normalizedResume,
          applicationId: app._id,
          status: app.status || "Applied",
          appliedAt: app.appliedAt,
          rawApp: app, // keep raw application if you want to accept/reject later
        };
      })
      .filter(Boolean);

    setJobApplicants(enriched);
    setLoading(false);
  }, [jobApplications, allUsers]);

  // Loading / authorization checks
  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p className="text-white text-lg">Loading applicants...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl bg-[#403d41] backdrop-blur-md p-8 rounded-2xl shadow-lg border-l-8 border-black-300">
          <h2 className="text-xl font-semibold text-white">Job not found</h2>
          <p className="text-gray-300 text-sm mt-2">The job you requested does not exist.</p>
          <div className="mt-6">
            <Button
              onClick={() => navigate(-1)}
              className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authorization: allow job poster or any applicant to view
  const jobPosterId = String(job.authorId || job.author || "").trim();
  const currentUserId = String(userId || profile?.id || "").trim();
  const isJobPoster = jobPosterId && jobPosterId === currentUserId;
  const isApplicant = jobApplicants.some((a) => String(a.id) === currentUserId);

  if (!isJobPoster && !isApplicant) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl bg-[#403d41] backdrop-blur-md p-8 rounded-2xl shadow-lg border-l-8 border-black-300">
          <h2 className="text-lg font-semibold text-white">Access denied</h2>
          <p className="text-gray-300 mt-2">You are not authorized to view the applicants for this job.</p>
          <div className="mt-6">
            <Button
              onClick={() => navigate(-1)}
              className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 rounded-xl px-4 py-2"
            >
              ← Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Icon used in JobList style
  const icon = (
    <span className="flex items-center justify-center w-12 h-12 bg-[#403d41] rounded-xl shadow-sm">
      <i className="fas fa-user text-2xl text-white" />
    </span>
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
      <h2 className="text-2xl font-extrabold text-white mb-4">
        Applicants for "{job.title}"
      </h2>

      {jobApplicants.length === 0 ? (
        <p className="text-white text-center mt-10">No applicants yet.</p>
      ) : (
        <div className="space-y-6">
          {jobApplicants.map((applicant) => {
            const isCurrentUser = String(applicant.id) === currentUserId;
            return (
              <div
                key={applicant.applicationId}
                className={`flex items-center gap-5 px-8 py-6 rounded-2xl border-l-8 border-black-300 bg-[#403d41]
                  transition-all duration-200
                  hover:shadow-lg`}
                style={{
                  boxShadow: "0 6px 24px 0 #e4ebfd",
                }}
              >
                {icon}
                <div className="flex-1 min-w-0">
                  {/* Applicant Name & Status */}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg text-white truncate">{applicant.fullName}</div>
                      <div className="text-sm text-gray-300">{applicant.email}</div>
                    </div>
                    <span className="bg-[#4a474b] text-gray-200 text-xs font-semibold px-3 py-1 rounded-full">
                      {applicant.status}
                    </span>
                  </div>

                  {applicant.skills && (
                    <div className="mt-2 text-gray-200 text-sm">
                      <strong>Skills:</strong> {Array.isArray(applicant.skills) ? applicant.skills.join(", ") : applicant.skills}
                    </div>
                  )}

                  <div className="text-gray-200 text-sm mt-2 line-clamp-3">{applicant.about || "No description provided."}</div>

                  {applicant.resumeUrl ? (
                    <div className="mt-3">
                      <a
                        href={`http://localhost:4000/${applicant.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 font-medium hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        View Resume
                      </a>
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-400 italic text-sm">Resume not provided</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    {/* If current user is job poster, show action buttons */}
                    {isJobPoster ? (
                      <>
                        {/* Accept/Reject buttons commented out - keeping your logic */}
                      </>
                    ) : (
                      <Button
                        onClick={() => navigate(`/profile/${applicant.id}`)}
                        className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
                      >
                        View Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
