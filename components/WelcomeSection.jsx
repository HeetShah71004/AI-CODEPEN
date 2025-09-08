import React from "react";
import { useAuth } from "../contexts/AuthContext";

const WelcomeSection = () => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-gray-700 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {getTimeOfDay()}, {user?.name}! 👋
          </h2>
          <p className="text-gray-300 mb-4">
            Ready to create something amazing with AI-powered coding?
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Account: {user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Member since: {formatDate(user?.createdAt)}</span>
            </div>
            {user?.lastLogin && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Last login: {formatDate(user?.lastLogin)}</span>
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
