import { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme.js";
import { LogOut, Moon, Sun, Gift, Cake } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, loadingUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const isHomePage = location.pathname === "/home";

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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <a href={isHomePage ? "#" : "/home"}>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bornify
                </h1>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Birthday Reminders
                </span>
              </div>
            </div>
          </a>

          {/* Actions Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            >
              <div className="relative w-4 h-4">
                <Sun className="w-4 h-4 text-yellow-600 transition-all duration-300 transform rotate-0 scale-100 dark:-rotate-90 dark:scale-0 absolute inset-0" />
                <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400 transition-all duration-300 transform rotate-90 scale-0 dark:rotate-0 dark:scale-100 absolute inset-0" />
              </div>
            </button>

            {/* Profile Section */}
            <div className="relative" ref={profileRef}>
              {/* User Avatar Button */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="Open Profile Menu"
              >
                <span className="text-white text-sm font-medium">
                  {loadingUser
                    ? "loading"
                    : user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "?"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* Profile Header */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || "No email provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="p-2 space-y-1">
                    {/* All Birthdays Navigation */}
                    <a
                      href="/birthdays"
                      className="block w-full text-start px-3 ps-6 py-2 text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      All Birthdays
                    </a>
                    {/* Settings Navigation */}
                    <a
                      href="/settings"
                      className="block w-full text-start  px-3 py-2 ps-6 text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Settings
                    </a>
                    <hr className="border-t border-gray-300 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-start space-x-2 px-3 py-3 ps-6 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
