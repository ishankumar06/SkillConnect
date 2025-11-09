import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getResumeById } from "../api/ResumeApi";
import Loading from "./Loading";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function Resume() {
  const location = useLocation();
  const navigate = useNavigate();

  const componentRef = useRef();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resumeId = location.state?._id;

  useEffect(() => {
    if (resumeId) {
      setLoading(true);
      getResumeById(resumeId)
        .then((data) => {
          setResumeData(data);
          setError(null);
        })
        .catch(() => setError("Failed to load resume. Please try again."))
        .finally(() => setLoading(false));
    } else if (location.state) {
      setResumeData(location.state);
    }
  }, [resumeId, location.state]);

  // Log customFields for debugging
  useEffect(() => {
    if (resumeData) {
      console.log("Full Resume Data:", resumeData);

      console.log("Custom Fields in Resume Data:", resumeData.customFields);
    }
  }, [resumeData]);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) {
      console.error("Element reference missing for PDF capture.");
      return;
    }

    const input = componentRef.current;
    const originalWidth = input.offsetWidth;
    const originalHeight = input.offsetHeight;

    try {
      const canvas = await html2canvas(input, {
        scale: 3,
        windowWidth: originalWidth,
        windowHeight: originalHeight,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const ratio = canvas.width / canvas.height;
      const imgHeight = pdfWidth / ratio;

      let heightLeft = imgHeight;
      let position = 0;

      while (heightLeft > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        if (heightLeft > 0) pdf.addPage();
      }

      const filename = `${resumeData?.basicInfo?.name || "Resume"}_${new Date()
        .toLocaleDateString()
        .replace(/\//g, "-")}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF. Please check the console for details.");
    }
  };

  if (loading) return <Loading />;

  if (error || !resumeData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {error || "No resume data available."}
        </h1>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );

  const {
    basicInfo: {
      name = "Your Name",
      email = "Email not provided",
      phone = "Phone not provided",
    } = {},
    summary = "",
    experience = [],
    education = [],
    skills = [],
    customFields = [],
  } = resumeData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div
        ref={componentRef}
        className="bg-white rounded shadow-lg w-full max-w-4xl p-8 md:p-10"
        style={{ maxWidth: "793px" }}
      >
       <div className="text-center mb-8">
  <h3 className="text-xl font-bold mb-2">{name}</h3>
  <p className="text-base text-gray-700">{email}</p>
  <p className="text-base text-gray-700">{phone}</p>
</div>


        {/* Personal Details */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
            Personal Details
          </h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
        </section>

        {/* Professional Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
              Professional Summary
            </h2>
            <p>{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
            Work Experience
          </h2>
          {experience.length === 0 && <p>No work experience added.</p>}
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <p><strong>Company:</strong> {exp.company || "-"}</p>
              <p><strong>Role:</strong> {exp.role || "-"}</p>
              <p>
                <strong>Duration:</strong> {exp.startDate || "-"} to {exp.endDate || "Present"}
              </p>
              {exp.description && <p>{exp.description}</p>}
              {i !== experience.length - 1 && <hr className="mt-3 border-gray-300" />}
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
            Education
          </h2>
          {education.length === 0 && <p>No education added.</p>}
          {education.map((edu, i) => (
            <div key={i} className="mb-4">
              <p><strong>Institution:</strong> {edu.institution || "-"}</p>
              <p><strong>Degree:</strong> {edu.degree || "-"}</p>
              <p>
                <strong>Duration:</strong> {edu.startDate || "-"} to {edu.endDate || "Present"}
              </p>
              {i !== education.length - 1 && <hr className="mt-3 border-gray-300" />}
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-3">
            Skills
          </h2>
          {skills.length === 0 && <p>No skills added.</p>}
          {skills.length > 0 && (
            <ul className="list-disc list-inside flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <li
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded"
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Custom Fields */}
        {customFields.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold border-b border-gray-300 pb-2 mb-4">
              Additional Information
            </h2>
            {customFields
              .filter(field => (field.title?.trim() || field.content?.trim()))
              .map((field, i, arr) => (
                <div key={i} className="mb-4 last:mb-0">
                  <h3 className="text-lg font-semibold">{field.title || "Custom Section"}</h3>
                  <p>{field.content || "-"}</p>
                  {i !== arr.length - 1 && <hr className="mt-3 border-gray-300" />}
                </div>
              ))}
          </section>
        )}
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-6 flex gap-4">
        <button
          disabled={!resumeData || !componentRef.current}
          className={`bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded transition flex items-center ${
            !resumeData || !componentRef.current ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleDownloadPDF}
        >
          {/* SVG icon for download */}
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download as PDF
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded transition"
          onClick={() => navigate("/homeresume", { state: resumeData })}
        >
          Back to Edit
        </button>
      </div>
    </div>
  );
}


export default Resume;
