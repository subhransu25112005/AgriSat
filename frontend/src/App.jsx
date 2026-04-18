import "./styles/cards.css";
import "./styles/Dashboard.css";
import "./styles/weather.css";
import "./styles/farmInsights.css";
import "./styles/splash.css";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import SplashScreen from "./components/SplashScreen";

// ── LAZY LOADED ROUTE COMPONENTS ───────────────────────────────────────
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));
const WeatherPage = lazy(() => import("./pages/WeatherPage"));
const NDVIMonitor = lazy(() => import("./pages/NDVIMonitor"));
const FarmInsights = lazy(() => import("./pages/FarmInsights"));
const Profile = lazy(() => import("./pages/Profile"));
const AddField = lazy(() => import("./pages/AddField"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Diagnosis = lazy(() => import("./pages/Diagnosis"));
const DiagnosisResult = lazy(() => import("./pages/DiagnosisResult"));
const SelectCrops = lazy(() => import("./pages/SelectCrops"));
const FertilizerCalculator = lazy(() => import("./pages/FertilizerCalculator"));
const PestsDiseases = lazy(() => import("./pages/PestsDiseases"));
const CultivationTips = lazy(() => import("./pages/CultivationTips"));
const PestAlerts = lazy(() => import("./pages/PestAlerts"));
const MarketPrices = lazy(() => import("./pages/MarketPrices"));
const GovtSchemes = lazy(() => import("./pages/GovtSchemes"));
const KnowledgeHub = lazy(() => import("./pages/KnowledgeHub"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Landing = lazy(() => import("./pages/Landing"));

// Standard imports for persistent UI
import OfflineBanner from "./components/OfflineBanner";
import FarmHelperChat from "./components/FarmHelperChat";
import UserPanel from "./components/UserPanel";
import ErrorBoundary from "./components/ErrorBoundary";

import api, { setAuth } from "./api/api";
import i18n from "./i18n";
import { useTranslation } from "react-i18next";

// ── GLOBAL SUSPENSE FALLBACK ──────────────────────────────────────────
const RouteLoader = () => (
  <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center animate-pulse">
    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
    <p className="text-gray-500 font-semibold tracking-widest uppercase text-xs">Loading Interface...</p>
  </div>
);



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
    <ErrorBoundary>
      <BrowserRouter>
        {/* SPLASH OVERLAY */}
        {!showUI && <SplashScreen />}

        {/* MAIN APP CONTENT */}
        {showUI && (
          <>
            {!token ? (
              <div className="min-h-dvh w-full overflow-x-hidden">
                <Suspense fallback={<RouteLoader />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Landing />} />
                      <Route path="/login" element={<Login onLogin={(tk) => { localStorage.setItem("token", tk); setToken(tk); setAuth(tk); }} />} />
                      <Route path="/signup" element={<Signup onSignedUp={(tk) => { localStorage.setItem("token", tk); setToken(tk); setAuth(tk); }} />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="*" element={<Landing />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </div>
            ) : (
              <div className="min-h-dvh w-full overflow-x-hidden bg-transparent">
                <OfflineBanner />
                {/* HEADER */}
                <header className="sticky top-0 z-[45]">
                  <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="w-10"></div>

                    <button
                      id="user-menu-btn"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl bg-black/40 hover:bg-neonGreen/20 text-text-primary transition-all font-black text-xl border border-glass-border shadow-soft"
                    >
                      ⋮
                    </button>
                  </div>
                </header>

                {/* ROUTES */}
                <main className="w-full max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8" style={{ minHeight: 'calc(100dvh - 72px)' }}>
                  <Suspense fallback={<RouteLoader />}>
                    <AnimatePresence mode="wait">
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
                        {/* Fallback for logged-in users */}
                        <Route path="*" element={<Dashboard />} />
                      </Routes>
                    </AnimatePresence>
                  </Suspense>
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
    </ErrorBoundary>
  );

}
