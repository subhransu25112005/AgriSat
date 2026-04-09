if (!import.meta.env.VITE_API_BASE) {
  console.warn("⚠️ VITE_API_BASE is missing from frontend .env file! Falling back to http://127.0.0.1:8000");
}
export const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";