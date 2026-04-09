import axios from "axios";
import { API_BASE } from "../config";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000
});

export function setAuth(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

// Global Interceptor for auth persistence
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global Interceptor for error handling (e.g. 401 logout, 500 alerts)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    if (err.response?.status >= 500) {
      // Show global toast or alert
      console.error("Critical Server Error:", err.response.data);
      alert("Something went wrong on our end. Please try again later.");
    }
    return Promise.reject(err);
  }
);

export default api;
