// src/hooks/useLanguage.js
import { useState, useEffect } from "react";

export const languages = {
  en: "English",
  hi: "हिंदी",
  or: "ଓଡିଆ"
};

export function useLanguage() {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  const changeLanguage = (l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  return { lang, changeLanguage };
}
