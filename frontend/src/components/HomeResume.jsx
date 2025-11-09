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
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-10 p-8 bg-white rounded-2xl shadow-xl"
    >
      <h1 className="text-3xl font-bold text-center mb-6">
         Resume Builder
      </h1>

      {/* Basic Info Section */}
      {[ 
        { id: "name", label: "Full Name", value: name, setter: setName },
        { id: "email", label: "Email", value: email, setter: setEmail },
        { id: "phone", label: "Phone", value: phone, setter: setPhone },
      ].map(({ id, label, value, setter }) => (
        <div
          key={id}
          className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl shadow-sm"
        >
          {icon}
          <label className="flex-1">
            <span className="font-semibold text-gray-700">{label}</span>
            <input
              id={id}
              required={label !== "Phone"}
              value={value}
              onChange={(e) => setter(e.target.value)}
              placeholder={`Enter your ${label.toLowerCase()}`}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-2">Professional Summary</h2>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          placeholder="Briefly describe your professional background"
          className="w-full border border-gray-300 rounded-md p-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Work Experience */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-800"> Work Experience</h2>
          <button
            type="button"
            onClick={handleAddExperience}
            className="text-blue-600 font-semibold hover:underline"
          >
            + Add Experience
          </button>
        </div>
        {experiences.map((exp, i) => (
          <div key={i} className="border-l-4 border-blue-400 pl-4 mb-4">
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[i].company = e.target.value;
                setExperiences(newExp);
              }}
              className="block w-full mb-2 border p-2 rounded-md text-gray-800"
            />
            <input
              placeholder="Role"
              value={exp.role}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[i].role = e.target.value;
                setExperiences(newExp);
              }}
              className="block w-full mb-2 border p-2 rounded-md text-gray-800"
            />
            <div className="flex gap-2 mb-2">
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[i].startDate = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-1/2 border p-2 rounded-md text-gray-800"
              />
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => {
                  const newExp = [...experiences];
                  newExp[i].endDate = e.target.value;
                  setExperiences(newExp);
                }}
                className="w-1/2 border p-2 rounded-md text-gray-800"
              />
            </div>
            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const newExp = [...experiences];
                newExp[i].description = e.target.value;
                setExperiences(newExp);
              }}
              rows={2}
              className="w-full border p-2 rounded-md text-gray-800"
            />
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-800"> Education</h2>
          <button
            type="button"
            onClick={handleAddEducation}
            className="text-blue-600 font-semibold hover:underline"
          >
            + Add Education
          </button>
        </div>
        {educations.map((edu, i) => (
          <div key={i} className="border-l-4 border-green-400 pl-4 mb-4">
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[i].institution = e.target.value;
                setEducations(newEdu);
              }}
              className="block w-full mb-2 border p-2 rounded-md text-gray-800"
            />
            <input
              placeholder="Degree / Field"
              value={edu.degree}
              onChange={(e) => {
                const newEdu = [...educations];
                newEdu[i].degree = e.target.value;
                setEducations(newEdu);
              }}
              className="block w-full mb-2 border p-2 rounded-md text-gray-800"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => {
                  const newEdu = [...educations];
                  newEdu[i].startDate = e.target.value;
                  setEducations(newEdu);
                }}
                className="w-1/2 border p-2 rounded-md text-gray-800"
              />
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => {
                  const newEdu = [...educations];
                  newEdu[i].endDate = e.target.value;
                  setEducations(newEdu);
                }}
                className="w-1/2 border p-2 rounded-md text-gray-800"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="bg-gray-50 p-5 rounded-xl shadow-md">
        <h2 className="font-bold text-xl text-gray-800 mb-2"> Skills</h2>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. React, Node.js, Leadership"
          className="w-full border p-2 rounded-md text-gray-800"
        />
      </div>

      {/* Custom Fields */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl text-gray-800"> Custom Fields</h2>
          <button
            type="button"
            onClick={handleAddCustomField}
            className="text-blue-600 font-semibold hover:underline"
          >
            + Add Field
          </button>
        </div>
        {customFields.map((field, i) => (
          <div key={i} className="border-l-4 border-purple-400 pl-4 mb-4">
            <input
              placeholder="Section Title (e.g. Projects)"
              value={field.title}
              onChange={(e) => {
                const newFields = [...customFields];
                newFields[i].title = e.target.value;
                setCustomFields(newFields);
              }}
              className="block w-full mb-2 border p-2 rounded-md text-gray-800"
            />
            <textarea
              placeholder="Content / Description"
              value={field.content}
              onChange={(e) => {
                const newFields = [...customFields];
                newFields[i].content = e.target.value;
                setCustomFields(newFields);
              }}
              rows={2}
              className="w-full border p-2 rounded-md text-gray-800"
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isFormValid()}
        className={`w-full py-3 text-lg font-semibold rounded-xl shadow-md transition 
          ${isFormValid()
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
      >
        Generate Resume
      </button>
    </form>
  );
}
