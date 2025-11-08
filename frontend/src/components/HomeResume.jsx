import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResume } from "../api/ResumeApi";
import Loading from "./Loading";

const icon = (
  <span className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm">
    <i className="fas fa-file-alt text-2xl text-gray-500" />
  </span>
);

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [experiences, setExperiences] = useState([
    { company: "", role: "", startDate: "", endDate: "", description: "" },
  ]);
  const [educations, setEducations] = useState([
    { institution: "", degree: "", startDate: "", endDate: "" },
  ]);
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isFormValid = () => name.trim() !== "" && email.trim() !== "";

  if (loading) return <Loading />;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
          alert("Please fill Name and Email");
          return;
        }
        setLoading(true);
        try {
          const resumeData = {
            basicInfo: { name, email, phone },
            summary,
            experience: experiences,
            education: educations,
            skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          };
          const savedResume = await createResume(resumeData);
          navigate("/resume", { state: savedResume });
        } catch {
          alert("Failed to save resume. Try again.");
        }
        setLoading(false);
      }}
      className="max-w-4xl mx-auto space-y-8 p-6 rounded-2xl bg-white shadow-lg"
      aria-label="Resume Builder Form"
    >
      <h1 className="text-3xl font-bold text-center mb-6">Resume Builder</h1>

      {/* Basic Info */}
      {[
        { id: "name", label: "Full Name", value: name, setter: setName, required: true },
        { id: "email", label: "Email", value: email, setter: setEmail, required: true, type: "email" },
        { id: "phone", label: "Phone", value: phone, setter: setPhone },
      ].map(({ id, label, value, setter, required, type = "text" }) => (
        <div key={id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl shadow">
          {icon}
          <label htmlFor={id} className="flex-1 block text-gray-700 font-semibold">
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
            <input
              id={id}
              required={required}
              type={type}
              placeholder={`Enter your ${label.toLowerCase()}`}
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </label>
        </div>
      ))}

      {/* Professional Summary */}
      <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl shadow">
        {icon}
        <label htmlFor="summary" className="flex-1 block text-gray-700 font-semibold">
          Professional Summary
          <textarea
            id="summary"
            placeholder="Briefly describe your professional background"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      {/* Experience and Education sections could be similarly wrapped in styled cards */}

      {/* Skills */}
      <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl shadow">
        {icon}
        <label htmlFor="skills" className="flex-1 block text-gray-700 font-semibold">
          Skills (comma separated)
          <input
            id="skills"
            placeholder="e.g. React, Node.js, Leadership"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition ${
          isFormValid() ? " bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Generate Resume
      </button>
    </form>
  );
}
