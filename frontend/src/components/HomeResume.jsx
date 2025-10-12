import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResume } from "../api/ResumeApi";
import Loading from "./Loading";

function Home() {
  // Basic info fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [summary, setSummary] = useState("");

  // Work experience: array of objects
  const [experiences, setExperiences] = useState([
    { company: "", role: "", startDate: "", endDate: "", description: "" },
  ]);

  // Education: array of objects
  const [educations, setEducations] = useState([
    { institution: "", degree: "", startDate: "", endDate: "" },
  ]);

  // Skills input as comma-separated string
  const [skills, setSkills] = useState("");

  // Loading state for submission
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (index) => {
    if (experiences.length === 1) return; // Prevent removing the last experience
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  // Education handlers
  const handleEducationChange = (index, field, value) => {
    const updated = [...educations];
    updated[index][field] = value;
    setEducations(updated);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      { institution: "", degree: "", startDate: "", endDate: "" },
    ]);
  };

  const removeEducation = (index) => {
    if (educations.length === 1) return; // Prevent removing the last education entry
    setEducations(educations.filter((_, i) => i !== index));
  };

  // Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation for required fields
    if (!name.trim() || !email.trim()) {
      alert("Please fill at least Name and Email");
      return;
    }

    // Prepare resume object according to your backend API shape
    const resumeData = {
      basicInfo: { name, email, phone },
      summary,
      experience: experiences,
      education: educations,
      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setLoading(true);
    try {
      const savedResume = await createResume(resumeData);
      // Navigate to resume preview page and pass the saved resume data in state
      navigate("/resume", { state: savedResume });
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-3xl w-full"
        aria-label="Resume Builder Form"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Resume Builder</h1>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2 font-semibold">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2 font-semibold">
              Email *
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2 font-semibold">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-6">
          <label htmlFor="summary" className="block text-gray-700 mb-2 font-semibold">
            Professional Summary
          </label>
          <textarea
            id="summary"
            placeholder="Briefly describe your professional background"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="p-3 border border-gray-300 rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Work Experience */}
        <div>
          <h2 className="text-xl font-bold mb-3">Work Experience</h2>
          {experiences.map((exp, index) => (
            <div key={index} className="mb-4 border border-gray-300 rounded p-4 relative">
              {experiences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                  aria-label={`Remove experience ${index + 1}`}
                >
                  &times;
                </button>
              )}
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                  className="p-2 border rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                  className="p-2 border rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                placeholder="Description and achievements"
                value={exp.description}
                onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                rows={3}
                className="p-2 border rounded w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            aria-label="Add more experience"
          >
            + Add Experience
          </button>
        </div>

        {/* Education */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3">Education</h2>
          {educations.map((edu, index) => (
            <div key={index} className="mb-4 border border-gray-300 rounded p-4 relative">
              {educations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
                  aria-label={`Remove education ${index + 1}`}
                >
                  &times;
                </button>
              )}
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                className="mb-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                  className="p-2 border rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                  className="p-2 border rounded w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            aria-label="Add more education"
          >
            + Add Education
          </button>
        </div>

        {/* Skills */}
        <div className="mt-8 mb-6">
          <label htmlFor="skills" className="block text-gray-700 mb-2 font-semibold">
            Skills (comma separated)
          </label>
          <input
            id="skills"
            type="text"
            placeholder="e.g. React, Node.js, Leadership"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition-colors"
          aria-label="Generate Resume"
        >
          Generate Resume
        </button>
      </form>
    </div>
  );
}

export default Home;
