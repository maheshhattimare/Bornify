import { useState, useEffect } from "react";
import {
  X,
  User,
  Upload,
  Trash2,
  Bell,
  Calendar,
  Heart,
  Gift,
  Camera,
} from "lucide-react";

const BirthdayModal = ({ birthday, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    relation: "",
    note: "",
    notifyBeforeDays: 7, // Default reminder 7 days before
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load birthday data when editing
  useEffect(() => {
    if (birthday) {
      setFormData({
        name: birthday.name || "",
        birthdate: birthday.birthdate?.split("T")[0] || "",
        relation: birthday.relation || "",
        note: birthday.note || "",
        notifyBeforeDays: birthday.notifyBeforeDays ?? 7,
        avatar: birthday.imageUrl || null,
      });
      setPreviewUrl(birthday.imageUrl || null);
    }
  }, [birthday]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle avatar upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          avatar: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Only image files are allowed",
        }));
        return;
      }

      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, avatar: file }));
      if (errors.avatar) {
        setErrors((prev) => ({ ...prev, avatar: "" }));
      }
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setPreviewUrl(null);
    if (errors.avatar) {
      setErrors((prev) => ({ ...prev, avatar: "" }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.birthdate) newErrors.birthdate = "Birth date is required";
    if (!formData.relation) newErrors.relation = "Relation is required";
    if (formData.notifyBeforeDays < 0)
      newErrors.notifyBeforeDays = "Invalid days";

    // Check if birth date is not in the future
    const selectedDate = new Date(formData.birthdate);
    const today = new Date();
    if (selectedDate > today) {
      newErrors.birthdate = "Birth date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("birthdate", formData.birthdate);
        formDataToSend.append("relation", formData.relation);
        formDataToSend.append("note", formData.note);
        formDataToSend.append("notifyBeforeDays", formData.notifyBeforeDays);

        if (formData.avatar instanceof File) {
          formDataToSend.append("avatar", formData.avatar);
        }

        await onSave(formDataToSend);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border-2 border-pink-200/50 dark:border-purple-600/30 animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-purple-900/30 border-b-2 border-pink-200/50 dark:border-purple-600/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {birthday ? "Edit Birthday" : "Add Birthday"}
                </h2>
                <p className="text-sm text-pink-600 dark:text-pink-400">
                  {birthday
                    ? "Update celebration details"
                    : "Create a new memory"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-pink-100 dark:hover:bg-purple-800/50 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Avatar Upload */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Camera className="w-4 h-4 text-pink-500" />
              <span>Profile Picture</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 flex items-center justify-center border-2 border-pink-200/50 dark:border-purple-600/30 shadow-lg">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 w-8 text-pink-400 dark:text-purple-400" />
                  )}
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Choose Photo</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </div>
            {errors.avatar && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.avatar}</span>
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 text-pink-500" />
              <span>Full Name *</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Relation */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Relationship *</span>
            </label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white"
            >
              <option value="">Select Relationship</option>
              <option value="Family">👨‍👩‍👧‍👦 Family</option>
              <option value="Friend">👥 Friend</option>
              <option value="Colleague">💼 Colleague</option>
              <option value="Partner">💕 Partner</option>
              <option value="Other">🤝 Other</option>
            </select>
            {errors.relation && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.relation}</span>
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-pink-500" />
              <span>Birth Date *</span>
            </label>
            <input
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white"
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.birthdate}</span>
              </p>
            )}
          </div>

          {/* Notify Before Days */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Bell className="w-4 h-4 text-pink-500" />
              <span>Reminder (days before)</span>
            </label>
            <div className="relative">
              <input
                name="notifyBeforeDays"
                type="number"
                min="0"
                max="365"
                value={formData.notifyBeforeDays}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white"
              />
              <div className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
                days
              </div>
            </div>
            {errors.notifyBeforeDays && (
              <p className="text-red-500 text-sm flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.notifyBeforeDays}</span>
              </p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Gift className="w-4 h-4 text-pink-500" />
              <span>Special Notes</span>
            </label>
            <textarea
              name="note"
              rows={3}
              value={formData.note}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border-2 border-pink-200/50 dark:border-purple-600/30 rounded-xl focus:border-pink-400 dark:focus:border-purple-400 focus:ring-2 focus:ring-pink-400/20 dark:focus:ring-purple-400/20 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              placeholder="Gift ideas, favorite things, special memories..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-medium hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{birthday ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  <span>{birthday ? "Update Birthday" : "Add Birthday"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthdayModal;
