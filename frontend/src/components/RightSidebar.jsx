import React from "react";
import { FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import the hook

export default function RightSidebar() {
  const navigate = useNavigate(); // Initialize the hook

  return (
    <aside className="w-72 bg-white shadow-lg  p-4 flex flex-col gap-4">
      {/* Resume Builder Section */}
      <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
          <FileText size={20} className="text-blue-600" />
          Resume Builder
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Create and customize your professional resume easily.
        </p>
        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/homeresume")} // Add navigation logic
        >
          Build Resume
        </button>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-2">
          <Info size={20} className="text-green-600" />
          About
        </h2>
        <p className="text-sm text-gray-600">
          SkillConnect helps you connect with the best job opportunities and
          showcase your skills effectively. Our platform bridges the gap between
          talent and recruiters.
        </p>
      </div>
    </aside>
  );
}

