import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "../context/UserProfileContext";
import { useUsers } from "../context/UsersContext";
import { useJob } from "../context/JobContext";

export default function Applicants() {
  const { jobId } = useParams();
  const { applications, fetchApplications } = useApplication();
  const { userId } = useAuth();
  const { profile } = useUserProfile();
  const { allUsers } = useUsers();
  const { jobs } = useJob();

  const [job, setJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);

  // Fetch applications on mount
  useEffect(() => {
    console.log("Applicants component mounted. Fetching applications...");
    if (fetchApplications && jobId) {
      fetchApplications(jobId);
    }
  }, [fetchApplications, jobId]);

  // Log jobId from useParams
  useEffect(() => {
    console.log("useParams jobId:", jobId);
  }, [jobId]);

  // Find the job by jobId
  useEffect(() => {
    if (!jobs || !jobId) {
      setJob(null);
      console.log("Jobs data or jobId missing; job set to null.");
      return;
    }
    const found = jobs.find((j) => {
      const id = typeof j === "string" ? j : j?._id?.toString();
      return id === jobId;
    });
    setJob(found || null);
    console.log("Job found:", found);
  }, [jobs, jobId]);

  // Filter applications related to this job
  useEffect(() => {
    if (!applications || !jobId) {
      setJobApplications([]);
      console.log("Applications data or jobId missing; no applications set.");
      return;
    }

    console.log("Filtering applications", applications);

    const filtered = applications.filter((app) => {
      let appJobId = null;
      if (app.jobId) {
        if (typeof app.jobId === "string") {
          appJobId = app.jobId;
        } else if (typeof app.jobId === "object" && app.jobId._id) {
          appJobId = app.jobId._id.toString();
        }
      }
      console.log(`Checking application: appJobId=${appJobId} vs jobId=${jobId}`);
      return appJobId?.trim() === jobId?.trim();
    });

    setJobApplications(filtered);
    console.log(`Filtered ${filtered.length} applications for jobId ${jobId}.`, filtered);
  }, [applications, jobId]);

  // Enrich applicant data with user profile info
  useEffect(() => {
    if (!jobApplications || !allUsers) {
      setJobApplicants([]);
      console.log("Either jobApplications or allUsers missing, cleared jobApplicants.");
      return;
    }

    console.log("Mapping job applications", jobApplications);

    const enriched = jobApplications
      .map((app) => {
        const userIdStr = app.applicantId?._id || app.applicantId;
        const userProfile = allUsers[userIdStr];
        if (!userProfile) {
          console.warn(`No profile found for applicantId ${userIdStr}`);
          return null;
        }
        const rawResume = app.resumeUrl || userProfile.resumeUrl || null;
        const normalizedResume = rawResume ? rawResume.replace(/\\/g, "/") : null;
        return {
          ...userProfile,
          id: userIdStr,
          about: app.about || userProfile.about || "No about info",
          skills: app.skills || userProfile.skills || "No skills",
          resumeUrl: normalizedResume,
          applicationId: app._id,
        };
      })
      .filter(Boolean);

    setJobApplicants(enriched);
    console.log("Enriched applicants:", enriched);
  }, [jobApplications, allUsers]);

  // Loading states
  if (!jobs || !jobs.length) {
    console.log("Jobs loading...");
    return <p className="text-center p-6">Loading jobs...</p>;
  }
  if (!applications) {
    console.log("Applications loading...");
    return <p className="text-center p-6">Loading applications...</p>;
  }
  if (!allUsers || !Object.keys(allUsers).length) {
    console.log("Users loading...");
    return <p className="text-center p-6">Loading users...</p>;
  }
  if (!profile) {
    console.log("User profile loading...");
    return <p className="text-center p-6">Loading profile...</p>;
  }

  if (!job) {
    console.log("Job not found or does not exist.");
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600 font-semibold">
        Job not found.
      </div>
    );
  }

  const jobPosterId = String(job.authorId || job.author || "").trim();
  const currentUserId = String(userId || profile.id || "").trim();
  const isJobPoster = jobPosterId === currentUserId;
  const isApplicant = jobApplicants.some((a) => a.id === currentUserId);

  console.log(`Authorization check: jobPosterId=${jobPosterId}, currentUserId=${currentUserId}, isJobPoster=${isJobPoster}, isApplicant=${isApplicant}`);

  if (!isJobPoster && !isApplicant) {
    console.log("Access denied - user is neither job poster nor an applicant.");
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600 font-semibold">
        Access denied. You are not authorized to view the applicants.
      </div>
    );
  }

   return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Applicants for Job ID: {jobId}</h2>

      {jobApplicants.length === 0 ? (
        <p className="text-gray-600 italic">No applicants yet.</p>
      ) : (
        <ul className="space-y-6">
          {jobApplicants.map((applicant) => {
            const isCurrentUser = applicant.id === currentUserId;
            return (
              <li
                key={applicant.applicationId}
                className={`border p-6 rounded-2xl shadow-md bg-white transition ${
                  isCurrentUser ? "border-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <h3 className="font-semibold text-xl text-gray-900">
                  {applicant.fullName}
                  {isCurrentUser && (
                    <span className="ml-3 px-2 py-1 text-sm bg-blue-200 text-blue-800 rounded-full">
                      You
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-gray-700">
                  <strong>Skills:</strong>{" "}
                  {Array.isArray(applicant.skills) ? applicant.skills.join(", ") : applicant.skills}
                </p>
                <p className="mt-1 text-gray-700">
                  <strong>About:</strong> {applicant.about}
                </p>
                {applicant.resumeUrl ? (
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-blue-600 hover:underline font-semibold"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="mt-3 text-gray-400 italic">Resume not provided</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}