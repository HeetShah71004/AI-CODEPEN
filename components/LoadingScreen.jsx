import React from "react";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-cyan-400 mb-2">AI CodePen</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
