import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "@/context/AuthContext";
import bgImage from "../assets/bgImage.png";

const icon = (
  <span className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm bg-[#403d41]">
    <i className="fas fa-file-alt text-2xl text-white" />
  </span>
);

function InputRow({ label, id, required, children, error }) {
  return (
    <div className="flex flex-col bg-[#403d41] rounded-2xl shadow p-4 gap-2 border-l-8 border-black-300" style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}>
      <label htmlFor={id} className="font-semibold text-white flex items-center gap-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex gap-4 items-center">{icon}{children}</div>
      {error && <p className="text-red-400 mt-1 text-sm">{error}</p>}
    </div>
  );
}

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
    if (formData.about.trim().length < 10) newErrors.about = "Write at least 10 characters";
    if (!formData.skills.trim()) newErrors.skills = "Please enter your skills";
    if (!formData.resumeFile) newErrors.resumeFile = "Resume file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    if (name === "resumeFile") {
      const acceptedTypes = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (files.length === 0 || !acceptedTypes.includes(files[0].type)) {
        setErrors((prev) => ({ ...prev, resumeFile: "Only PDF or Word documents are allowed" }));
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
      setStatusMessage("Error: Missing job ID!");
      return;
    }
    if (!userId) {
      setStatusMessage("Please log in to apply.");
      return;
    }
    try {
      setSubmitting(true);
      const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean);
      await applyToJob(jobId, formData.resumeFile, formData.name, formData.about, skillsArray);
      setStatusMessage("Application submitted successfully!");
      setFormData({ name: "", resumeFile: null, about: "", skills: "" });
      navigate("/applied");
    } catch {
      setStatusMessage("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-[#403d41] rounded-3xl p-10 shadow-lg space-y-8 border-l-8 border-black-300"
        style={{ boxShadow: "0 6px 24px 0 #e4ebfd" }}
        noValidate
      >
        <h1 className="text-4xl font-bold text-center text-white">Apply for Job</h1>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl border-l-4 ${
              statusMessage.toLowerCase().includes("success")
                ? "bg-green-500/20 text-green-200 border-green-400"
                : "bg-red-500/20 text-red-200 border-red-400"
            }`}
            role="alert"
          >
            {statusMessage}
          </div>
        )}

        <InputRow label="Name" id="nameInput" required error={errors.name}>
          <input
            id="nameInput"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="mt-2 w-full rounded-xl border border-gray-600 p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            required
            autoComplete="name"
          />
        </InputRow>

        <InputRow label="Upload Resume (PDF or DOC)" id="resumeFileInput" required error={errors.resumeFile}>
          <input
            id="resumeFileInput"
            name="resumeFile"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            className="mt-2 w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            aria-invalid={!!errors.resumeFile}
            aria-describedby={errors.resumeFile ? "resumeFile-error" : undefined}
            required
            autoComplete="off"
          />
        </InputRow>

        <button
          type="button"
          onClick={() => navigate("/homeresume")}
          className="w-full bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 py-3 transition font-semibold"
        >
          Generate Resume using AI
        </button>

        <InputRow label="About Yourself" id="aboutInput" required error={errors.about}>
          <textarea
            id="aboutInput"
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={5}
            placeholder="Write a short bio..."
            className="mt-2 w-full rounded-xl border border-gray-600 p-3 resize-none focus:outline-none focus:ring-4 focus:ring-blue-400 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
            aria-invalid={!!errors.about}
            aria-describedby={errors.about ? "about-error" : undefined}
            required
            autoComplete="off"
          />
        </InputRow>

        <InputRow label="Skills (Comma separated)" id="skillsInput" required error={errors.skills}>
          <input
            id="skillsInput"
            name="skills"
            type="text"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. JavaScript, React, Node.js"
            className="mt-2 w-full rounded-xl border border-gray-600 p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition bg-[#4a474b]/50 text-white placeholder-gray-400"
            aria-invalid={!!errors.skills}
            aria-describedby={errors.skills ? "skills-error" : undefined}
            required
            autoComplete="off"
          />
        </InputRow>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-4 transition font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 ${
            submitting
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
