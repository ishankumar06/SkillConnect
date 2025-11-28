import React from "react";
import { FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import the hook

export default function RightSidebar() {
  const navigate = useNavigate(); // Initialize the hook

  return (
    <aside className="w-72 bg-black shadow-lg  p-4 h-screen flex flex-col gap-1">
      {/* Resume Builder Section */}
      <div className="bg-[#403d41] rounded-xl p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-2">
          <FileText size={20} className="text-black" />
          Resume Builder
        </h2>
        <p className="text-sm text-white mb-3">
          Create and customize your professional resume easily.
        </p>
        <button
          className="w-full bg-[#403d41] text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 rounded-xl shadow-sm px-4 transition"
          onClick={() => navigate("/homeresume")} // Add navigation logic
        >
          Build Resume
        </button>
      </div>

      {/* About Section */}
      <div className="bg-[#403d41] rounded-xl p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-2">
          <Info size={20} className="text-black" />
          About
        </h2>
        <p className="text-sm text-white">
          SkillConnect helps you connect with the best job opportunities and
          showcase your skills effectively. Our platform bridges the gap between
          talent and recruiters.
        </p>
      </div>
    </aside>
  );
}

