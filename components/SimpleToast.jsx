import React, { useState, useEffect } from "react";

const SimpleToast = ({
  message,
  type = "logout",
  isVisible,
  onClose,
  duration = 4000,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isAnimating) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600
          shadow-2xl shadow-purple-500/25
          text-white px-6 py-4 rounded-2xl
          transform transition-all duration-500 ease-out
          ${
            isAnimating
              ? "translate-x-0 opacity-100 scale-100"
              : "translate-x-full opacity-0 scale-95"
          }
          max-w-sm min-w-[320px] backdrop-blur-sm border border-purple-400/20
        `}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-7 h-7"
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
          </div>
          <div className="flex-1">
            <p className="font-bold text-white leading-tight text-lg">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 hover:rotate-90"
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

        {/* Animated progress bar */}
        <div className="mt-4 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-100"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping opacity-40"></div>
          <div
            className="absolute top-6 right-8 w-1 h-1 bg-purple-200 rounded-full animate-ping opacity-60"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-4 left-8 w-1 h-1 bg-blue-200 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "1s" }}
          ></div>
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
      `}</style>
    </div>
  );
};

export default SimpleToast;
