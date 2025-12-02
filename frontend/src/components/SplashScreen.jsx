import React, { useEffect } from "react";
import "../styles/splash.css";   // correct working path

export default function SplashScreen() {
  return (
    <div className="splash-container">
      <img src="/glogo.png" className="splash-logo" alt="AgriSat" />
    </div>
  );
}
