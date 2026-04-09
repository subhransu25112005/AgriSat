import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/api";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.add(savedTheme);
    setDarkMode(savedTheme === "dark");
  }, []);

  const changeLanguage = async (lng) => {
    try {
      i18n.changeLanguage(lng);
      localStorage.setItem("lang", lng);
      await api.post("/auth/update-language", { language: lng }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.className.includes("dark");

    if (isDark) {
      document.documentElement.className = "light";
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.className = "dark";
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT — LOGO */}
        <img
          src="/glogo.png"
          alt="AgriSat Logo"
          className="h-10 w-auto object-contain"
        />

        {/* RIGHT — 3 DOT MENU */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 text-3xl leading-none px-2 select-none"
          >
            ⋮
          </button>

          {/* DROPDOWN MENU */}
          {menuOpen && (
            <div className="language-panel absolute right-0 mt-2 w-44 rounded-lg p-2 space-y-2 animate-fadeIn z-50">
              
              {/* Change Language */}
              <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                {t("menu.language")}
              </div>
              <div className="flex gap-2 px-3 pb-2">
                <button
                  onClick={() => changeLanguage("en")}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage("hi")}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  HI
                </button>
                <button
                  onClick={() => changeLanguage("or")}
                  className="px-2 py-1 text-xs bg-gray-100 rounded"
                >
                  OR
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                {darkMode ? t("menu.lightMode") : t("menu.darkMode")}
              </button>

              {/* Feedback */}
              <button
                onClick={() => alert("Feedback page coming soon")}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                {t("menu.feedback")}
              </button>

              {/* About Creator */}
              <button
                onClick={() => alert("Created by Subhranshu Nanda ❤️")}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
              >
                {t("menu.creator")}
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
