import React from "react";
import { Gift, Cake, PartyPopper, Heart } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
      {/* Main Loading Content */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* App Icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">🎂</span>
          </div>
        </div>

        {/* Simple Loading Spinner */}
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>

        {/* App Name */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Bornify
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Loading your birthday reminders...
          </p>
        </div>

        {/* Simple Progress Indicator */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
