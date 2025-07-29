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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md border border-white/20 dark:border-gray-700/20 animate-scaleIn">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Add Your Birthday
          </h2>

          <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-2">
            Help us celebrate your special day! 🎉
          </p>

          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={saving}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Input */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
              Your Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" />
              <input
                type="date"
                value={dob}
                onChange={handleDateChange}
                disabled={saving}
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700/50 rounded-2xl p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200 font-medium text-sm">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !dob}
              className="flex-1 py-3.5 px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Save Birthday</span>
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              disabled={saving}
              className="py-3.5 px-6 bg-gray-150 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              Cancel
            </button>
          </div>

          {/* Birthday Fun Fact */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎂</span>
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                Fun Fact
              </span>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-200">
              We'll use this to remind you and your friends about upcoming
              birthdays!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDOBModal;
