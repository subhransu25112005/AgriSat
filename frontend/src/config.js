if (!import.meta.env.VITE_API_URL) {
  console.warn("⚠️ VITE_API_URL is missing from frontend .env file! Falling back to http://127.0.0.1:8000");
}
export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";