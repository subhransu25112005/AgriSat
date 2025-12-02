import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";


// Correct CSS imports
import "./index.css";      // Tailwind must be here
import "./i18n";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

createRoot(document.getElementById("root")).render(<App />);
