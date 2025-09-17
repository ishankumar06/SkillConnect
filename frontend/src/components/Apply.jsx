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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.about.trim().length < 10)
      newErrors.about = "Please write at least 10 characters about yourself";
    if (!formData.skills.trim()) newErrors.skills = "Please enter your skills";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) =>
      name === "resumeFile" ? { ...prev, resumeFile: files[0] } : { ...prev, [name]: value }
    );
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
    // Prepare skills as an array from comma-separated string
    const skillsArray = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    // Call applyToJob and pass skillsArray
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
  }catch (error) {
  setStatusMessage("Failed to submit application. Please try again.");

  if (error.response) {
    console.error("Apply error response data:", JSON.stringify(error.response.data, null, 2));
    console.error("Apply error response status:", error.response.status);
    console.error("Apply error response headers:", error.response.headers);
  } else if (error.request) {
    console.error("Apply error request made but no response:", error.request);
  } else {
    console.error("Apply error message:", error.message);
  }
}

};


  const handleAIResumeBuilder = () => {
    alert("AI Resume Builder feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-3xl p-10 shadow-lg"
        noValidate
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Apply for Job</h1>

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
        <label htmlFor="nameInput" className="flex flex-col mb-6 font-semibold text-gray-900">
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
          />
          {errors.name && <span className="text-red-500 mt-1 text-sm">{errors.name}</span>}
        </label>

        {/* Resume Upload */}
        <label htmlFor="resumeFileInput" className="flex flex-col mb-6 font-semibold text-gray-900">
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
          />
        </label>

        <button
          type="button"
          onClick={handleAIResumeBuilder}
          className="mb-6 w-full bg-indigo-600 text-white font-semibold rounded-xl py-3 hover:bg-indigo-700 transition"
        >
          Generate Resume using AI
        </button>

        {/* About */}
        <label htmlFor="aboutInput" className="flex flex-col mb-6 font-semibold text-gray-900">
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
          />
          {errors.about && <span className="text-red-500 mt-1 text-sm">{errors.about}</span>}
        </label>

        {/* Skills */}
        <label htmlFor="skillsInput" className="flex flex-col mb-6 font-semibold text-gray-900">
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
          />
          {errors.skills && <span className="text-red-500 mt-1 text-sm">{errors.skills}</span>}
        </label>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-extrabold py-3 rounded-xl hover:bg-green-700 transition shadow-lg"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}
