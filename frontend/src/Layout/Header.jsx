import { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme.js";
import { LogOut, Moon, Sun, Gift, Cake } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, loadingUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Handles closing the profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the profile dropdown area
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    // Add event listener only when the profile dropdown is open
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  // Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
      setIsLoggingOut(false);
    }, 1000);
  };

  return (
    <nav className=" bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-slate-900 dark:to-black backdrop-blur-lg border-b-2 border-pink-200/50 dark:border-slate-700 shadow-xl sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                <Gift className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                <Cake className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Bornify
              </h1>
              <span className="text-xs text-pink-600/70 dark:text-pink-400/70 font-medium -mt-1">
                Birthday Memories
              </span>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="group relative p-3 bg-gradient-to-r from-white/80 to-pink-50/80 dark:from-slate-800/80 dark:to-purple-900/50 hover:from-pink-100 hover:to-purple-100 dark:hover:from-purple-800/50 dark:hover:to-indigo-800/50 rounded-2xl border-2 border-pink-200/50 dark:border-purple-600/30 shadow-lg dark:shadow-purple-900/30 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:-translate-y-0.5"
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              <div className="relative w-5 h-5">
                <Sun className="w-5 h-5 text-yellow-500 transition-all duration-500 transform rotate-0 scale-100 dark:-rotate-180 dark:scale-0 absolute inset-0" />
                <Moon className="w-5 h-5 text-indigo-400 dark:text-purple-400 transition-all duration-500 transform rotate-180 scale-0 dark:rotate-0 dark:scale-100 absolute inset-0" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/0 to-purple-400/0 group-hover:from-pink-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
            </button>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              {/* User Avatar Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="group relative w-11 h-11 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 hover:from-pink-500 hover:via-purple-600 hover:to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-purple-500/30 transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:-translate-y-0.5 ring-2 ring-white/50 dark:ring-purple-500/30"
                title="Open Profile Menu"
              >
                <span className="text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">
                  {user?.name.charAt(0).toUpperCase()}{" "}
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-transparent transition-all duration-300"></div>
              </button>
              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl dark:shadow-purple-900/50 border-2 border-pink-200/50 dark:border-purple-600/30 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
                  {/* Profile Header */}
                  <div className="p-5 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/30 border-b-2 border-pink-200/50 dark:border-purple-600/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">
                          {user?.name.charAt(0).toUpperCase()}{" "}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg truncate">
                          {user?.name}{" "}
                        </p>
                        <p className="text-sm text-pink-600 dark:text-pink-400 truncate">
                          {user?.email || "No email provided"}{" "}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="p-3">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                          <span>Sign Out</span>
                        </>
                      )}{" "}
                    </button>
                  </div>
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
