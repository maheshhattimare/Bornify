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
        backdrop-blur-md border-t transition-all duration-300 
        ${className}
      `}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-pink-200/30 via-purple-200/30 to-indigo-200/30 dark:from-slate-700/50 dark:via-purple-700/50 dark:to-indigo-700/50"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-8 text-pink-200 dark:text-pink-800/50 opacity-60 animate-bounce">
          <Gift className="w-3 h-3" />
        </div>
        <div className="absolute top-1 right-12 text-purple-200 dark:text-purple-800/50 opacity-60 animate-pulse">
          <Cake className="w-2.5 h-2.5" />
        </div>
        <div className="absolute top-3 right-24 text-indigo-200 dark:text-indigo-800/50 opacity-60 animate-bounce delay-300">
          <Sparkles className="w-2 h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 relative">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-3 sm:space-y-0 animate-fadeIn">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className="text-gray-600 dark:text-gray-400">
              © {currentYear}
              Made with
            </span>
            <div className="relative group">
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse group-hover:animate-bounce transition-all duration-300" />
              <div className="absolute -inset-1 bg-red-100 dark:bg-red-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-ping"></div>
            </div>
            <span className="text-gray-600 dark:text-gray-400">by</span>
            <a
              href={authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-1 group transform hover:scale-105 active:scale-95 relative"
            >
              <span className="relative">
                {authorName}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </span>
              <ExternalLink className="w-3 h-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-full border border-pink-200/50 dark:border-slate-700">
              <span className="text-xs font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Bornify
              </span>
              <div className="flex items-center space-x-0.5">
                <span className="text-xs animate-bounce">🎂</span>
                <span className="text-xs animate-bounce delay-200">🎉</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 animate-slideUp font-medium">
              All Rights Reserved.
            </div>
          </div>
        </div>

        <div className="sm:hidden flex justify-center mt-4">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/50 dark:bg-slate-800/50 rounded-full border border-pink-200/50 dark:border-slate-700">
            <span className="text-xs font-semibold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Bornify - Never Miss a Birthday
            </span>
            <div className="flex items-center space-x-0.5">
              <span className="text-xs animate-bounce">🎂</span>
              <span className="text-xs animate-bounce delay-200">🎉</span>
              <span className="text-xs animate-bounce delay-400">🎁</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
