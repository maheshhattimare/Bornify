import { useState } from "react";
import { Calendar, Gift, X, Check, AlertCircle, Loader2 } from "lucide-react";

function UserDOBModal({ isOpen, onClose, onSave }) {
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!dob) {
      setError("Please select your date of birth");
      return;
    }

    // Validate date is not in the future
    const selectedDate = new Date(dob);
    const today = new Date();
    if (selectedDate > today) {
      setError("Date of birth cannot be in the future");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onSave(dob);
      // onSave should handle closing the modal on success
    } catch (err) {
      setError("Failed to save date of birth. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      setDob("");
      setError("");
      onClose();
    }
  };

  const handleDateChange = (e) => {
    setDob(e.target.value);
    if (error) setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
            Add Your Birthday
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
            We'll remind you about upcoming birthdays
          </p>

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={saving}
            className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dob}
                onChange={handleDateChange}
                disabled={saving}
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !dob}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Birthday</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              disabled={saving}
              className="py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md border border-gray-300 dark:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">ℹ️</span>
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Privacy Note
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Your birthday information is stored locally and used only for
              reminders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDOBModal;
