import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "hi", "or"],
    fallbackLng: "en",
    lng: localStorage.getItem("lang") || "en",

    backend: {
      loadPath: "/locales/{{lng}}.json"
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
