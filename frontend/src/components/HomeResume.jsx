import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResume } from "../api/ResumeApi";
import Loading from "./Loading";

const icon = (
  <span className="flex items-center justify-center w-12 h-12 rounded-xl shadow-sm">
    <i className="fas fa-file-alt text-2xl text-gray-500" />
  </span>
);

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");

  // Dynamic sections
  const [experiences, setExperiences] = useState([
    { company: "", role: "", startDate: "", endDate: "", description: "" },
  ]);
  const [educations, setEducations] = useState([
    { institution: "", degree: "", startDate: "", endDate: "" },
  ]);
  const [customFields, setCustomFields] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = () => name.trim() !== "" && email.trim() !== "";

  const handleAddExperience = () =>
    setExperiences([
      ...experiences,
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ]);

  const handleAddEducation = () =>
    setEducations([
      ...educations,
      { institution: "", degree: "", startDate: "", endDate: "" },
    ]);

  const handleAddCustomField = () =>
    setCustomFields([...customFields, { title: "", content: "" }]);

  const handleSubmit = async (e) => {
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
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        customFields,
      };
      const savedResume = await createResume(resumeData);
      console.log("Saved Resume (after create):", savedResume);
      navigate("/resume", { state: savedResume });
    } catch {
      alert("Failed to save resume. Try again.");
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto w-full space-y-10 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-black bg-clip-text text-transparent mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional resumes in minutes
          </p>
        </div>

        {/* Basic Info Section */}
        {[
          { id: "name", label: "Full Name", value: name, setter: setName },
          { id: "email", label: "Email", value: email, setter: setEmail },
          { id: "phone", label: "Phone", value: phone, setter: setPhone },
        ].map(({ id, label, value, setter }) => (
          <div
            key={id}
            className="flex items-start gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            {icon}
            <label className="flex-1">
              <span className="block font-bold text-xl text-gray-800 mb-3">
                {label}
              </span>
              <input
                id={id}
                required={label !== "Phone"}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={`Enter your ${label.toLowerCase()}`}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all"
              />
            </label>
          </div>
        ))}

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-2xl shadow-lg">
          <h2 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-3">
            <i className="fas fa-user text-emerald-600" />
            Professional Summary
          </h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={5}
            placeholder="Briefly describe your professional background, key achievements, and career goals..."
            className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50 backdrop-blur-sm resize-vertical transition-all"
          />
        </div>

        {/* Work Experience */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-3">
              <i className="fas fa-briefcase text-orange-600" />
              Work Experience
            </h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus" />
              Add Experience
            </button>
          </div>
          {experiences.map((exp, i) => (
            <div key={i} className="border-l-6 border-orange-400 pl-8 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[i].company = e.target.value;
                    setExperiences(newExp);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50"
                />
                <input
                  placeholder="Job Title / Role"
                  value={exp.role}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[i].role = e.target.value;
                    setExperiences(newExp);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[i].startDate = e.target.value;
                    setExperiences(newExp);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50"
                />
                <input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExp = [...experiences];
                    newExp[i].endDate = e.target.value;
                    setExperiences(newExp);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50"
                />
              </div>
              <textarea
                placeholder="Key responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[i].description = e.target.value;
                  setExperiences(newExp);
                }}
                rows={4}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 bg-white/50 resize-vertical"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-3">
              <i className="fas fa-graduation-cap text-emerald-600" />
              Education
            </h2>
            <button
              type="button"
              onClick={handleAddEducation}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus" />
              Add Education
            </button>
          </div>
          {educations.map((edu, i) => (
            <div key={i} className="border-l-6 border-emerald-400 pl-8 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                  placeholder="University / Institution"
                  value={edu.institution}
                  onChange={(e) => {
                    const newEdu = [...educations];
                    newEdu[i].institution = e.target.value;
                    setEducations(newEdu);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50"
                />
                <input
                  placeholder="Degree / Field of Study"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...educations];
                    newEdu[i].degree = e.target.value;
                    setEducations(newEdu);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => {
                    const newEdu = [...educations];
                    newEdu[i].startDate = e.target.value;
                    setEducations(newEdu);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50"
                />
                <input
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => {
                    const newEdu = [...educations];
                    newEdu[i].endDate = e.target.value;
                    setEducations(newEdu);
                  }}
                  className="p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 bg-white/50"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl">
          <h2 className="font-bold text-3xl text-gray-800 mb-6 flex items-center gap-3">
            <i className="fas fa-star text-purple-600" />
            Skills
          </h2>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, Python, Leadership, Team Management, AWS"
            className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 bg-white/50 transition-all"
          />
        </div>

        {/* Custom Fields */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-3">
              <i className="fas fa-cog text-indigo-600" />
              Custom Fields
            </h2>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 shadow-lg transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus" />
              Add Field
            </button>
          </div>
          {customFields.map((field, i) => (
            <div key={i} className="border-l-6 border-indigo-400 pl-8 mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
              <input
                placeholder="Section Title (e.g. Projects, Certifications, Awards)"
                value={field.title}
                onChange={(e) => {
                  const newFields = [...customFields];
                  newFields[i].title = e.target.value;
                  setCustomFields(newFields);
                }}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl mb-4 focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white/50"
              />
              <textarea
                placeholder="Content / Description"
                value={field.content}
                onChange={(e) => {
                  const newFields = [...customFields];
                  newFields[i].content = e.target.value;
                  setCustomFields(newFields);
                }}
                rows={4}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white/50 resize-vertical"
              />
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`w-full py-6 text-2xl font-bold rounded-3xl shadow-2xl transition-all transform hover:-translate-y-1 hover:shadow-3xl duration-300 flex items-center justify-center gap-3 ${
            isFormValid()
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
              : "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed"
          }`}
        >
          <i className="fas fa-rocket" />
          Generate My Resume
        </button>
      </form>
    </div>
  );
}
