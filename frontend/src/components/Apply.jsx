import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";

export default function ApplyPage() {
  const { id: jobId } = useParams();
  const { applyToJob } = useApplication();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    resumeFile: null,
    about: "",
    skills: "",
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.about.trim().length < 10)
      newErrors.about = "Please write at least 10 characters about yourself";
    if (!formData.skills.trim()) newErrors.skills = "Please enter your skills";
    if (!formData.resumeFile) newErrors.resumeFile = "Resume file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Clear error for the specific field on change
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Validate resume file type on selection
    if (name === "resumeFile") {
      const acceptedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (files.length === 0 || !acceptedTypes.includes(files[0].type)) {
        setErrors((prev) => ({
          ...prev,
          resumeFile: "Only PDF or Word documents are allowed",
        }));
        setFormData((prev) => ({ ...prev, resumeFile: null }));
        return;
      }
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!validate()) return;

    if (!jobId) {
      setStatusMessage("Error: Cannot apply, job ID is missing from the URL!");
      return;
    }

    if (!userId) {
      setStatusMessage("Please log in to apply for this job!");
      return;
    }

    try {
      setSubmitting(true);
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      await applyToJob(
        jobId,
        formData.resumeFile,
        formData.name,
        formData.about,
        skillsArray
      );

      setStatusMessage("Application submitted successfully!");
      setFormData({ name: "", resumeFile: null, about: "", skills: "" });
      navigate("/applied");
    } catch (error) {
      setStatusMessage("Failed to submit application. Please try again.");

      if (error.response) {
        console.error(
          "Apply error response data:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error("Apply error response status:", error.response.status);
        console.error("Apply error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Apply error request made but no response:", error.request);
      } else {
        console.error("Apply error message:", error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAIResumeBuilder = () => {
    navigate("/homeresume");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl p-10 shadow-lg"
        noValidate
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Apply for Job
        </h1>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-6 p-3 rounded ${
              statusMessage.toLowerCase().includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            role="alert"
          >
            {statusMessage}
          </div>
        )}

        {/* Name */}
        <label
          htmlFor="nameInput"
          className="flex flex-col mb-6 font-semibold text-gray-900"
        >
          Name <span className="text-red-500">*</span>
          <input
            type="text"
            id="nameInput"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-2 p-3 rounded-xl border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-4 focus:ring-blue-400 transition`}
            placeholder="Enter your full name"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span id="name-error" className="text-red-500 mt-1 text-sm">
              {errors.name}
            </span>
          )}
        </label>

        {/* Resume Upload */}
        <label
          htmlFor="resumeFileInput"
          className="flex flex-col mb-6 font-semibold text-gray-900"
        >
          Upload Resume (PDF or DOC) <span className="text-red-500">*</span>
          <input
            type="file"
            id="resumeFileInput"
            name="resumeFile"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="mt-2 cursor-pointer"
            required
            autoComplete="off"
            aria-invalid={errors.resumeFile ? "true" : "false"}
            aria-describedby={errors.resumeFile ? "resumeFile-error" : undefined}
          />
          {errors.resumeFile && (
            <span id="resumeFile-error" className="text-red-500 mt-1 text-sm">
              {errors.resumeFile}
            </span>
          )}
        </label>

        {/* AI Resume Builder Button */}
        <button
          type="button"
          onClick={handleAIResumeBuilder}
          className="mb-6 w-full bg-indigo-600 text-white font-semibold rounded-xl py-3 hover:bg-indigo-700 transition"
        >
          Generate Resume using AI
        </button>

        {/* About */}
        <label
          htmlFor="aboutInput"
          className="flex flex-col mb-6 font-semibold text-gray-900"
        >
          About Yourself <span className="text-red-500">*</span>
          <textarea
            id="aboutInput"
            name="about"
            value={formData.about}
            onChange={handleChange}
            className={`mt-2 p-3 rounded-xl border ${
              errors.about ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-4 focus:ring-blue-400 transition resize-none`}
            rows={5}
            placeholder="Write a short bio..."
            autoComplete="off"
            aria-invalid={errors.about ? "true" : "false"}
            aria-describedby={errors.about ? "about-error" : undefined}
          />
          {errors.about && (
            <span id="about-error" className="text-red-500 mt-1 text-sm">
              {errors.about}
            </span>
          )}
        </label>

        {/* Skills */}
        <label
          htmlFor="skillsInput"
          className="flex flex-col mb-6 font-semibold text-gray-900"
        >
          Skills (Comma separated) <span className="text-red-500">*</span>
          <input
            type="text"
            id="skillsInput"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={`mt-2 p-3 rounded-xl border ${
              errors.skills ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-4 focus:ring-blue-400 transition`}
            placeholder="e.g. JavaScript, React, Node.js"
            autoComplete="off"
            aria-invalid={errors.skills ? "true" : "false"}
            aria-describedby={errors.skills ? "skills-error" : undefined}
          />
          {errors.skills && (
            <span id="skills-error" className="text-red-500 mt-1 text-sm">
              {errors.skills}
            </span>
          )}
        </label>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white font-extrabold py-3 rounded-xl hover:bg-green-700 transition shadow-lg disabled:opacity-50"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
