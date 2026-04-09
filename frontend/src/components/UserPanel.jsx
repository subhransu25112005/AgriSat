import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { me } from "../api/auth";
import api from "../api/api";

export default function UserPanel({ onClose, onLogout, onLanguageChange, onThemeToggle, darkMode }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    me().then(setUser).catch(() => { });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hasSeenWelcome");
    onLogout?.();
    onClose();
    navigate("/login");
  };

  const navItems = [
    { icon: "👤", label: t("panel.profile", "My Profile"), path: "/profile" },
    { icon: "🌾", label: t("panel.farms", "My Farms"), path: "/add-field" },
    { icon: "💡", label: t("panel.insights", "Saved Insights"), path: "/farm-insights" },
    { icon: "🔔", label: t("panel.notifications", "Notifications"), path: null },
    { icon: "📚", label: t("panel.knowledge", "Knowledge Hub"), path: "/knowledge-hub" },
    { icon: "🆘", label: t("panel.help", "Help & Support"), path: null },
    { icon: "ℹ️", label: t("panel.about", "About AgriSat"), path: null },
  ];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">AgriSat</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-base">{user.name || "Farmer"}</p>
                <p className="text-xs text-green-100 truncate">{user.email || user.phone || ""}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-white/20" />
              <div>
                <div className="h-4 bg-white/20 rounded w-28 mb-1" />
                <div className="h-3 bg-white/20 rounded w-20" />
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {navItems.map((item, i) => (
            <motion.div key={i} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}>
              {item.path ? (
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 transition"
                >
                  <span className="text-xl w-7 text-center">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-4 px-6 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 transition"
                >
                  <span className="text-xl w-7 text-center">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )}
            </motion.div>
          ))}

          <div className="mx-4 my-2 h-px bg-gray-100 dark:bg-gray-800" />

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-4">
              <span className="text-xl w-7 text-center">🌙</span>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                {t("panel.dark_mode", "Dark Mode")}
              </span>
            </div>
            <button
              onClick={onThemeToggle}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="px-6 py-2">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">{t("panel.language", "Language")}</p>
            <div className="flex gap-2">
              {["en", "hi", "or"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => { onLanguageChange?.(lang); onClose(); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${i18n.language === lang
                      ? "bg-green-600 text-white border-green-600"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400"
                    }`}
                >
                  {lang === "en" ? "EN" : lang === "hi" ? "हि" : "ଓ"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 transition"
          >
            🔐 {t("panel.logout", "Logout")}
          </button>
        </div>
      </motion.div>
    </>
  );
}
