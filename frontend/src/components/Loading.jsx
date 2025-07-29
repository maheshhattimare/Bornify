import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>

      {/* App Name */}
      <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200 animate-pulse">
        Bornify 🎉
      </h1>

      {/* Small Hint */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Preparing your birthdays...
      </p>
    </div>
  );
};

export default Loading;
