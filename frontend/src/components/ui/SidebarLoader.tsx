import React from "react";

const SidebarLoader = () => {
  return (
    <div className="w-80 h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Animated Loader */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse opacity-75"></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <p className="text-gray-300 text-lg font-medium mb-2">
          Loading Dashboard
        </p>
        <p className="text-gray-500 text-sm">Please wait a moment...</p>
      </div>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-4">
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
};

export default SidebarLoader;
