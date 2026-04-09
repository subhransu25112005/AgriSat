import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";


// Correct CSS imports
import "./index.css";      // Tailwind must be here
import "./i18n";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.className = savedTheme;

createRoot(document.getElementById("root")).render(
  <React.Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">Loading...</div>}>
    <App />
  </React.Suspense>
);
