
import { useNavigate } from "react-router-dom";

export default function Promotion() {
  const navigate = useNavigate();

  // Sample urgent jobs data
  const urgentJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Google",
      location: "Mountain View, CA",
      urgency: "Urgently Hiring!",
      description:
        "Join Google as a Frontend Developer to build fast and user-friendly web applications.",
      salary: "$120,000 - $150,000",
      workType: "Full-time",
    },
    {
      id: 2,
      title: "Data Scientist",
      company: "Amazon",
      location: "Seattle, WA",
      urgency: "Immediate Opening",
      description:
        "Work on large scale data projects to extract business insights and influence product decisions.",
      salary: "$110,000 - $140,000",
      workType: "Full-time",
    },
    // Add more jobs as needed
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Urgent Job Openings</h1>
        <p className="text-gray-600">
          Check out these urgent job positions that need employees immediately.
        </p>
        <button
          onClick={() => navigate(-1)} // Navigate back
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {urgentJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
              <p className="text-blue-600 font-semibold mb-1">{job.urgency}</p>
              <p className="text-gray-700 mb-1">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Location:</strong> {job.location}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Work Type:</strong> {job.workType}
              </p>
              <p className="text-gray-600 mb-4">{job.description}</p>
            </div>
            <div className="mt-auto">
              <p className="text-green-600 font-bold text-lg">{job.salary}</p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
                onClick={() => alert(`Applied for ${job.title}`)}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
