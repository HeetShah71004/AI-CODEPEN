import React, { useState, useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-600",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ),
          shadow: "shadow-green-500/25",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          shadow: "shadow-blue-500/25",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-500 to-orange-600",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ),
          shadow: "shadow-yellow-500/25",
        };
      case "logout":
        return {
          bg: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600",
          icon: (
            <svg
              className="w-6 h-6"
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
          ),
          shadow: "shadow-purple-500/25",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-600 to-gray-700",
          icon: null,
          shadow: "shadow-gray-500/25",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${styles.bg} ${styles.shadow}
          text-white px-6 py-4 rounded-2xl shadow-2xl 
          transform transition-all duration-500 ease-out
          ${
            isAnimating
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-full opacity-0 scale-95"
          }
          max-w-sm min-w-[300px] backdrop-blur-sm
        `}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
            {styles.icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white leading-tight">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white bg-opacity-40 rounded-full animate-shrink"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-shrink {
          animation: shrink ${duration}ms linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
