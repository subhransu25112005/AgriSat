import "./styles/cards.css";
import "./styles/Dashboard.css";
import "./styles/weather.css";
import "./styles/farmInsights.css";
import "./styles/splash.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
            <Login
              onLogin={(tk) => {
                localStorage.setItem("token", tk);
                setToken(tk);
                setAuth(tk);
              }}
            />
          ) : (
            <div className="min-h-screen">
              {/* HEADER */}
              <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
                  <img src="/glogo.png" alt="AgriSat" className="h-10 w-auto" />

                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="text-3xl px-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    ⋮
                  </button>
                </div>

                {menuOpen && (
                  <div className="absolute right-4 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2 text-sm">
                    <button
                      onClick={toggleDarkMode}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? t("Light Mode") : t("Dark Mode")}
                    </button>

                    <div className="px-3 pt-2 text-gray-500 text-xs">{t("Language")}</div>

                    <button
                      onClick={() => changeLanguage("en")}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("English")}
                    </button>
                    <button
                      onClick={() => changeLanguage("hi")}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                     {t("हिन्दी")}
                    </button>
                    <button
                      onClick={() => changeLanguage("or")}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("ଓଡିଆ")}
                    </button>

                    <hr className="my-2" />

                    <button
                      onClick={() =>
                        (window.location.href = "mailto:subhransu25112005@gmail.com")
                      }
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("Give Feedback")}
                    </button>

                    <button
                      onClick={() => alert("Created by Subhranshu Nanda ❤")}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("About Creator")}
                    </button>
                  </div>
                )}
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          )}
        </>
      )}
    </BrowserRouter>
  );
}
