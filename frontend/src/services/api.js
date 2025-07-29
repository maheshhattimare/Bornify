import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

// Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired/invalid tokens globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem("token");

    // If token is expired or invalid and user has a token, logout user
    if ((status === 401 || status === 403) && token) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; // force logout
    }

    return Promise.reject(error);
  }
);

export default API;
