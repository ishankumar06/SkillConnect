import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import { useJob } from "../context/JobContext";
import Button from "../components/ui/Button";
import bgImage from "../assets/bgImage.png";

/**
 * Applicants page — UI matched to JobList styling (cards, shadows, yellow buttons)
 */
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
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 text-lg animate-pulse">
        Loading applicants...
      </div>
    );
  }

  if (!job) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center p-8 text-center text-red-600"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-3xl bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow">
          <h2 className="text-xl font-semibold">Job not found</h2>
          <p className="text-sm text-gray-600 mt-2">The job you requested does not exist.</p>
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
        <div className="max-w-3xl bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow text-center">
          <h2 className="text-lg font-semibold text-red-600">Access denied</h2>
          <p className="text-gray-600 mt-2">You are not authorized to view the applicants for this job.</p>
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
    <span className="flex items-center justify-center w-12 h-12 bg-black-50 rounded-xl shadow-sm">
      <i className="fas fa-user text-2xl text-black-500" />
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-black-800">
            Applicants for "{job.title}"
          </h2>
          <p className="text-sm text-gray-500 mt-1">{job.company || job.author || ""}</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
          >
            ← Back
          </Button>
        </div>
      </div>

      {jobApplicants.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No applicants yet.</p>
      ) : (
        <div className="space-y-6">
          {jobApplicants.map((applicant) => {
            const isCurrentUser = String(applicant.id) === currentUserId;
            return (
              <div
                key={applicant.applicationId}
                className="flex items-start gap-5 px-8 py-6 rounded-2xl border-l-8 border-black-300 shadow-md bg-white transition-all duration-200 hover:shadow-lg"
                style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}
              >
                {icon}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <div className="font-bold text-lg text-black-900 truncate">
                        {applicant.fullName}
                      </div>
                      <div className="text-sm text-gray-500">{applicant.email}</div>
                    </div>

                    <div className="text-right">
                      <span className="bg-black-50 text-black-500 text-xs font-semibold px-3 py-1 rounded-full ml-4">
                        {applicant.status}
                      </span>
                      {isCurrentUser && (
                        <div className="mt-2 text-xs text-blue-600 font-semibold">You</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-gray-600 text-sm">
                    <strong>Skills:</strong>{" "}
                    {Array.isArray(applicant.skills) ? applicant.skills.join(", ") : applicant.skills}
                  </div>

                  <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                    {applicant.about || "No description provided."}
                  </p>

                  {applicant.resumeUrl ? (
                    <div className="mt-3">
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View Resume
                      </a>
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-400 italic">Resume not provided</p>
                  )}

                  <div className="flex gap-2 mt-4">
                    {/* If current user is job poster, show action buttons */}
                    {isJobPoster ? (
                      <>
                        <Button
                          onClick={() => {
                            // Hook into your accept/reject logic here
                            // e.g., call an API or context action to update application status
                            alert(`Accept ${applicant.fullName} — implement API call`);
                          }}
                          className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 rounded-xl shadow-sm px-4 transition"
                        >
                          Accept
                        </Button>

                        <Button
                          onClick={() => {
                            alert(`Reject ${applicant.fullName} — implement API call`);
                          }}
                          className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 rounded-xl shadow-sm px-4 transition"
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => navigate(`/profile/${applicant.id}`)}
                        className="bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 rounded-xl shadow-sm px-4 transition"
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
