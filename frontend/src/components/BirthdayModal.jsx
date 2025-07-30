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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 pb-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {birthday ? "Edit Birthday" : "Add Birthday"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {birthday
                    ? "Update celebration details"
                    : "Create a new memory"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
        >
          {/* Avatar Upload */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Camera className="w-4 h-4 text-purple-500" />
              <span>Profile Picture</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-purple-400" />
                  )}
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
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
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">Choose Photo</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 text-purple-500" />
              <span>Full Name *</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Heart className="w-4 h-4 text-purple-500" />
              <span>Relationship *</span>
            </label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white"
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
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Birth Date *</span>
            </label>
            <input
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white"
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
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Bell className="w-4 h-4 text-purple-500" />
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white"
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
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Gift className="w-4 h-4 text-purple-500" />
              <span>Special Notes</span>
            </label>
            <textarea
              name="note"
              rows={3}
              value={formData.note}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              placeholder="Gift ideas, favorite things, special memories..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{birthday ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
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
