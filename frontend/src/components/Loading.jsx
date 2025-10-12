import React from "react";

function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"
        aria-hidden="true"
      ></div>
      <span className="ml-4 text-lg text-gray-700">Loading</span>
    </div>
  );
}

export default Loading;
