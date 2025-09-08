import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MagicIcon, FormatIcon, SpinnerIcon, DownloadIcon } from "./Icons";
import SimpleToast from "./SimpleToast";

const Header = ({
  onFormatCode,
  onGenerateAI,
  onDownload,
  onDownloadWithPath,
  onDownloadToDefault,
  onDownloadIndividual,
  isFormatting,
}) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDownloadDropdownOpen, setIsDownloadDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dropdownRef = useRef(null);
  const downloadDropdownRef = useRef(null);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowToast(true);

    // Add a small delay for the toast to appear before logout
    setTimeout(() => {
      logout();
    }, 2000); // Give time to see the toast
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDownloadDropdown = () => {
    setIsDownloadDropdownOpen(!isDownloadDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        downloadDropdownRef.current &&
        !downloadDropdownRef.current.contains(event.target)
      ) {
        setIsDownloadDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-cyan-400">AI CodePen</h1>
          <span className="text-gray-500 text-sm">
            Build amazing things with AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Download Dropdown */}
          <div className="relative" ref={downloadDropdownRef}>
            <button
              onClick={toggleDownloadDropdown}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-md hover:bg-green-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              aria-label="Download options"
              title="Download options"
            >
              <DownloadIcon />
              Download
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDownloadDropdownOpen && (
              <div className="absolute right-0 top-12 bg-gray-800 border border-gray-600 rounded-lg shadow-xl w-64 z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onDownloadWithPath();
                      setIsDownloadDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                    title="Choose where to save the ZIP file"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Choose Save Location</div>
                      <div className="text-xs text-gray-400">
                        ZIP with folder picker
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadToDefault();
                      setIsDownloadDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                    title="Download to Downloads folder"
                  >
                    <DownloadIcon />
                    <div>
                      <div className="font-medium">Quick Download</div>
                      <div className="text-xs text-gray-400">
                        ZIP to Downloads folder
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onDownloadIndividual();
                      setIsDownloadDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                    title="Download individual HTML, CSS, JS files"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <div className="font-medium">Individual Files</div>
                      <div className="text-xs text-gray-400">
                        Separate HTML, CSS, JS
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onFormatCode}
            disabled={isFormatting}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 disabled:opacity-50"
            aria-label="Format code"
          >
            {isFormatting ? <SpinnerIcon /> : <FormatIcon />}
            Format Code
          </button>
          <button
            onClick={onGenerateAI}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
            aria-label="Generate code with AI"
          >
            <MagicIcon />
            Generate with AI
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="User menu"
            >
              {getUserInitials(user?.name)}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-12 bg-gray-800 border border-gray-600 rounded-lg shadow-xl w-64 z-50">
                <div className="p-4 border-b border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-600 text-white font-semibold rounded-full">
                      {getUserInitials(user?.name)}
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-sm">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amazing Logout Toast */}
      <SimpleToast
        message={`Goodbye, ${user?.name}! 👋 You've been logged out successfully.`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />
    </header>
  );
};

export default Header;
