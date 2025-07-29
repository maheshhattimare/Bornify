import API from "./api.js";

// Update logged-in user's Date of Birth
export const updateDob = async (dob) => {
  try {
    const res = await API.put("/users/dob", { dob });
    return res.data;
  } catch (error) {
    console.error("Error updating DOB:", error);
    throw error.response?.data || { message: "Failed to update DOB" };
  }
};
