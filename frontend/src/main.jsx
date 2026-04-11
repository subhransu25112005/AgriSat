import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// Correct CSS imports
import "./index.css";      // Tailwind must be here
import "./i18n";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("🚀 PWA: Service Worker registered");

        // Detect new versions
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("✨ PWA: New update available. Refreshing...");
                // Note: sw.js skipWaiting() will trigger controllerchange
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("❌ PWA: Registration failed:", error);
      });

    // Handle the reload when the new worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.className = savedTheme;

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
