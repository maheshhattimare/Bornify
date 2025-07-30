import { Heart, ExternalLink, Gift, Cake, Sparkles } from "lucide-react";

const Footer = ({
  authorName = "Mahesh",
  authorUrl = "https://maheshhattimare.vercel.app/",
  position = "relative", // relative, fixed, sticky
  theme = "auto", // auto, light, dark
  className = "",
}) => {
  const currentYear = new Date().getFullYear();

  const getPositionClasses = () => {
    switch (position) {
      case "fixed":
        return "fixed bottom-0 left-0 right-0 z-50";
      case "sticky":
        return "sticky bottom-0 z-40";
      default:
        return "relative";
    }
  };

  // ✅ Updated Theme-aware classes
  const getThemeClasses = () => {
    if (theme === "light") {
      return "bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-indigo-50/50 text-gray-700 border-pink-100";
    } else if (theme === "dark") {
      return "bg-gradient-to-br from-gray-950 via-slate-900 to-black text-gray-300 border-slate-700";
    }
    // Auto theme
    return "bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-black text-gray-700 dark:text-gray-300 border-pink-100 dark:border-slate-700";
  };

  return (
    <footer
      className={`
        ${getPositionClasses()}
        ${getThemeClasses()}
        border-t border-gray-200 dark:border-gray-700 transition-colors duration-200
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              © {currentYear} Made with
            </span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-gray-600 dark:text-gray-400">by</span>
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center space-x-1"
            >
              <span>{authorName}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Bornify
              </span>
              <span className="text-gray-500 dark:text-gray-500">🎂</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              All Rights Reserved
            </div>
          </div>
        </div>

        <div className="sm:hidden flex justify-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Never miss a birthday again
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
