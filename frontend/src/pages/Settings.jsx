import { useState } from "react";
import { User, Bell, Download, Trash2, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john@example.com",
    enableReminders: true,
    daysBefore: 3,
    emailReminders: true,
  });

  const { user } = useAuth();

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDaysChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      daysBefore: parseInt(e.target.value),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your account and notification preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Account Section */}
          <SectionCard
            icon={<User className="icon text-gray-600 dark:text-gray-200" />}
            title="Account Information"
            subtitle="Update your personal details"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LabeledInput label="Full Name" value={user?.name} readOnly />
              <LabeledInput
                label="Email Address"
                value={user?.email}
                type="email"
              />
            </div>
          </SectionCard>
          <p className="text-center text-red-900">
            The following features have not been implemented yet
          </p>

          {/* Notifications */}
          <SectionCard
            icon={<Bell className="icon text-green-600 dark:text-green-400" />}
            title="Notification Settings"
            subtitle="Control how and when you receive reminders"
          >
            <ToggleSetting
              title="Birthday Reminders"
              description="Get notified about upcoming birthdays"
              enabled={settings.enableReminders}
              onToggle={() => handleToggle("enableReminders")}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-4">
              <div className="flex-1 mb-4 sm:mb-0">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Reminder Timing
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  How many days before the birthday should we remind you?
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.daysBefore}
                  onChange={handleDaysChange}
                  className="w-20 px-3 py-2 text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  days before
                </span>
              </div>
            </div>
            <ToggleSetting
              title="Email Notifications"
              description="Receive reminders via email"
              enabled={settings.emailReminders}
              onToggle={() => handleToggle("emailReminders")}
              className="mt-4"
            />
          </SectionCard>

          {/* Data Management */}
          <SectionCard
            icon={
              <Download className="icon text-orange-600 dark:text-orange-400" />
            }
            title="Data Management"
            subtitle="Export or manage your birthday data"
          >
            <button className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3 text-sm font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition">
              <Download className="w-4 h-4" />
              <span>Export Birthday Data (CSV)</span>
            </button>
          </SectionCard>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-800 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="icon-wrapper bg-red-100 dark:bg-red-900/30">
                <Trash2 className="icon text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Danger Zone
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Irreversible actions — proceed with caution
                </p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800 rounded-lg">
              <h3 className="font-medium text-red-800 dark:text-red-300 mb-2">
                Delete Account
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                This will permanently delete your account and all associated
                birthday data. This action cannot be undone.
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md font-medium transition">
                Delete My Account
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

//
// Reusable components below
//

const LabeledInput = ({ label, value, type = "text", readOnly = false }) => (
  <div>
    <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      readOnly={readOnly}
      className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const SectionCard = ({ icon, title, subtitle, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center space-x-3 mb-4">
      <div className="icon-wrapper">{icon}</div>
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const ToggleSetting = ({
  title,
  description,
  enabled,
  onToggle,
  className = "",
}) => (
  <div
    className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${className}`}
  >
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
        enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Shared style
const styles = `
.icon-wrapper {
  @apply w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center;
}
.icon {
  @apply w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400;
}
`;
