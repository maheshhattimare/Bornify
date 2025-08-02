import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Handle expired/invalid token responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // If token is invalid or expired
    if ((status === 401 || status === 403) && localStorage.getItem("token")) {
      localStorage.removeItem("token");

      // Optionally: you can clear other user-related states here
      alert("Your session has expired or is invalid. Please log in again.");

      // Use a small delay to allow alert to show before redirect
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }

    return Promise.reject(error);
  }
);

export default API;
