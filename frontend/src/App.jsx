import "./styles/cards.css";
import "./styles/Dashboard.css";
import "./styles/weather.css";
import "./styles/farmInsights.css";
import "./styles/splash.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import SplashScreen from "./components/SplashScreen";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import WeatherPage from "./pages/WeatherPage";
import NDVIMonitor from "./pages/NDVIMonitor";
import FarmInsights from "./pages/FarmInsights";
import Profile from "./pages/Profile";
import AddField from "./pages/AddField";
import NotFound from "./pages/NotFound";
import Diagnosis from "./pages/Diagnosis";
import DiagnosisResult from "./pages/DiagnosisResult";
import SelectCrops from "./pages/selectcrops";
import FertilizerCalculator from "./pages/FertilizerCalculator";
import PestsDiseases from "./pages/PestsDiseases";
import CultivationTips from "./pages/CultivationTips";
import PestAlerts from "./pages/PestAlerts";
import MarketPrices from "./pages/MarketPrices";
import GovtSchemes from "./pages/GovtSchemes";
import KnowledgeHub from "./pages/KnowledgeHub";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./pages/Welcome";
import Landing from "./pages/Landing";

import OfflineBanner from "./components/OfflineBanner";
import FarmHelperChat from "./components/FarmHelperChat";
import UserPanel from "./components/UserPanel";

import api, { setAuth } from "./api/api";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

export default function App() {
  // 🔥 All hooks must be here (no conditional returns before hooks)
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
  }, []);


  // Splash timeout
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Auth token update
  useEffect(() => {
    setAuth(token);
  }, [token]);


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("lang", lng);
      setMenuOpen(false)
    } catch (err) {
      console.error("Language change error:", err);
    }
  };


  // 🎉 Show SplashScreen visually, but DO NOT skip hooks
  const showUI = !loading;

  return (
    <BrowserRouter>
      {/* SPLASH OVERLAY */}
      {!showUI && <SplashScreen />}

      {/* MAIN APP CONTENT */}
      {showUI && (
        <>
          {!token ? (
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login onLogin={(tk) => { localStorage.setItem("token", tk); setToken(tk); setAuth(tk); }} />} />
                <Route path="/signup" element={<Signup onSignedUp={(tk) => { localStorage.setItem("token", tk); setToken(tk); setAuth(tk); }} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Landing />} />
              </Routes>
            </div>
          ) : (
            <div className="min-h-screen">
              <OfflineBanner />
              {/* HEADER */}
              <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                  <img src="/glogo.png" alt="AgriSat" className="h-10 w-auto" />

                  <button
                    id="user-menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-3xl px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    ⋮
                  </button>
                </div>
              </header>

              {/* ROUTES */}
              <main className="p-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/ndvi" element={<NDVIMonitor />} />
                  <Route path="/farm-insights" element={<FarmInsights />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/add-field" element={<AddField />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/diagnosis" element={<Diagnosis />} />
                  <Route path="/diagnosis/result" element={<DiagnosisResult />} />
                  <Route path="/select-crops" element={<SelectCrops />} />
                  <Route path="/fertilizer" element={<FertilizerCalculator />} />
                  <Route path="/pests" element={<PestsDiseases />} />
                  <Route path="/cultivation-tips" element={<CultivationTips />} />
                  <Route path="/pest-alerts" element={<PestAlerts />} />
                  <Route path="/market-prices" element={<MarketPrices />} />
                  <Route path="/govt-schemes" element={<GovtSchemes />} />
                  <Route path="/knowledge-hub" element={<KnowledgeHub />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <FarmHelperChat />

              {/* ANIMATED USER PANEL */}
              <AnimatePresence>
                {menuOpen && (
                  <UserPanel
                    onClose={() => setMenuOpen(false)}
                    onLogout={() => { localStorage.removeItem("token"); setToken(null); }}
                    onLanguageChange={changeLanguage}
                    onThemeToggle={toggleDarkMode}
                    darkMode={darkMode}
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </BrowserRouter>
  );
}
