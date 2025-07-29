// services/birthdayService.js
import API from "./api.js";

/**
 * Fetch all birthdays
 */
export const getBirthdays = async () => {
  try {
    const res = await API.get("/birthdays");
    return { success: true, data: res.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to fetch birthdays.";
    console.error("Error fetching birthdays:", message);
    throw { success: false, message };
  }
};

/**
 * Add a new birthday
 * @param {FormData|Object} formData - If including an image, use FormData
 */
export const addBirthday = async (formData) => {
  try {
    const isFormData = formData instanceof FormData;
    const res = await API.post("/birthdays", formData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return { success: true, data: res.data };
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to add birthday.";
    console.error("Error adding birthday:", message);
    throw { success: false, message };
  }
};

/**
 * Update an existing birthday
 * @param {string} id - Birthday record ID
 * @param {FormData|Object} formData
 */
export const updateBirthday = async (id, formData) => {
  try {
    const isFormData = formData instanceof FormData;
    const res = await API.put(`/birthdays/${id}`, formData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return { success: true, data: res.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to update birthday.";
    console.error("Error updating birthday:", message);
    throw { success: false, message };
  }
};

/**
 * Delete a birthday
 * @param {string} id - Birthday record ID
 */
export const deleteBirthday = async (id) => {
  try {
    const res = await API.delete(`/birthdays/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to delete birthday.";
    console.error("Error deleting birthday:", message);
    throw { success: false, message };
  }
};
