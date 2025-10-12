import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
      <p className="mb-6">Try restarting the process.</p>
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}

export default ErrorPage;
