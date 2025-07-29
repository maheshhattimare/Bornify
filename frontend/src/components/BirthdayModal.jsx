import { useState, useEffect } from "react";
import { X, User, Upload, Trash2, Bell } from "lucide-react";

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
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setPreviewUrl(null);
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.birthdate) newErrors.birthdate = "Birth date is required";
    if (!formData.relation) newErrors.relation = "Relation is required";
    if (formData.notifyBeforeDays < 0)
      newErrors.notifyBeforeDays = "Invalid days";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("relation", formData.relation);
      formDataToSend.append("note", formData.note);
      formDataToSend.append("notifyBeforeDays", formData.notifyBeforeDays);

      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }

      onSave(formDataToSend);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {birthday ? "Edit Birthday" : "Add Birthday"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="block mb-3">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
                <label
                  htmlFor="avatar-upload"
                  className="btn-secondary cursor-pointer"
                >
                  <Upload className="h-4 w-4 inline-block mr-2" /> Upload
                </label>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block mb-2">Name *</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Relation */}
          <div>
            <label className="block mb-2">Relation *</label>
            <select
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Relation</option>
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
              <option value="Other">Other</option>
            </select>
            {errors.relation && (
              <p className="text-red-500 text-sm">{errors.relation}</p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label className="block mb-2">Birth Date *</label>
            <input
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              className="input-field"
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm">{errors.birthdate}</p>
            )}
          </div>

          {/* Notify Before Days */}
          <div>
            <label className="mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary-600" /> Notify Before (days)
            </label>
            <input
              name="notifyBeforeDays"
              type="number"
              min="0"
              value={formData.notifyBeforeDays}
              onChange={handleChange}
              className="input-field"
            />
            {errors.notifyBeforeDays && (
              <p className="text-red-500 text-sm">{errors.notifyBeforeDays}</p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block mb-2">Note</label>
            <textarea
              name="note"
              rows={3}
              value={formData.note}
              onChange={handleChange}
              className="input-field"
              placeholder="Gift ideas, relation details..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              {birthday ? "Update" : "Add"}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthdayModal;
