import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const LANDING_URL = import.meta.env.VITE_LANDING_URL || "http://localhost:5173";

// One axios instance for the whole dashboard: sends the httpOnly auth cookie with every request.
const api = axios.create({ baseURL: API_URL, withCredentials: true });

// If the session is missing or expired, send the user back to the login page.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = `${LANDING_URL}/login`;
    }
    return Promise.reject(err);
  }
);

export default api;
