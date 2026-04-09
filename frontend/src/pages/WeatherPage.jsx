import React, { useEffect, useState } from "react";
import WeatherGraph from "../components/weather/WeatherGraph";
import AQICard from "../components/weather/AQICard";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function WeatherPage() {
  const { t, i18n } = useTranslation();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advisory, setAdvisory] = useState({ text: "", type: "neutral" });

  // Your city
  const lat = 20.2961;
  const lon = 85.8245;

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    async function load() {
      if (!API_KEY) {
        console.warn("⚠️ VITE_WEATHER_API_KEY is missing from frontend .env! Weather API calls will fail.");
      }
      try {
        // CURRENT WEATHER
        const now = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ).then((r) => r.json());

        // 5-DAY / 3-HOUR FORECAST
        const fc = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        ).then((r) => r.json());

        // AIR QUALITY
        const aq = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        ).then((r) => r.json());

        const dailyData = fc.list.filter((_, i) => i % 8 === 0).slice(0, 6);
        const hourlyData = fc.list.slice(0, 10); // 10 hours

        setCurrent(now);
        setForecast(dailyData);
        setHourly(hourlyData);
        setAqi(aq.list[0]);
        
        // Generate Smart Advisory
        generateAdvisory(now, hourlyData);
        
        setLoading(false);
      } catch (e) {
        console.log("Weather error:", e);
      }
    }

    load();
  }, []);

  const generateAdvisory = (currentWeather, hourlyData) => {
    const isRaining = currentWeather.weather[0].main.toLowerCase().includes("rain");
    const temp = currentWeather.main.temp;
    const windSpeed = currentWeather.wind.speed;
    const willRainSoon = hourlyData.slice(0, 4).some(h => h.weather[0].main.toLowerCase().includes("rain"));

    if (isRaining) {
      setAdvisory({
        text: t("advisory.heavy_rain", "Avoid watering today. Ensure proper drainage in the field to prevent root rot."),
        type: "warning"
      });
    } else if (willRainSoon) {
      setAdvisory({
        text: t("advisory.rain_soon", "Rain expected within hours. Postpone any fertilizer or pesticide spraying to avoid runoff."),
        type: "caution"
      });
    } else if (windSpeed > 5) {
      setAdvisory({
        text: t("advisory.high_wind", "High wind speeds detected. Not a suitable time for foliar spraying."),
        type: "caution"
      });
    } else if (temp > 32) {
      setAdvisory({
        text: t("advisory.heat", "High temperature. Water your crops early in the morning or late evening to reduce evaporation."),
        type: "info"
      });
    } else {
      setAdvisory({
        text: t("advisory.optimal", "Optimal weather conditions. Good time for general field maintenance and crop monitoring."),
        type: "success"
      });
    }
  };

  if (loading) return <div className="text-center p-10 text-lg">{t("common.loading")}</div>;

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString();

  const advisoryStyles = {
    warning: "bg-red-100 border-red-200 text-red-800",
    caution: "bg-yellow-100 border-yellow-200 text-yellow-800",
    info: "bg-blue-100 border-blue-200 text-blue-800",
    success: "bg-green-100 border-green-200 text-green-800",
    neutral: "bg-white border-gray-200 text-gray-800"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 pb-20">

      {/* SMART ADVISORY CARD */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`p-5 rounded-2xl border-2 mb-6 shadow-sm ${advisoryStyles[advisory.type]}`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">💡</span>
          <h2 className="font-bold text-lg uppercase tracking-wide">{t("advisory.title", "Smart Advisory")}</h2>
        </div>
        <p className="font-medium">{advisory.text}</p>
      </motion.div>

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {current.name} {t("weatherPage.todayWeather")}
      </h1>

      {/* CURRENT CARD */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm mb-8 flex justify-between items-center border border-gray-100 dark:border-gray-700">
        <div>
          <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
            {Math.round(current.main.temp)}°C
          </div>
          <div className="capitalize text-gray-600 dark:text-gray-400 text-lg mt-1">
            {current.weather[0].description}
          </div>
          <div className="mt-2 text-xs font-bold text-gray-400 uppercase">
            {t("weatherPage.feelsLike", "Feels like")} {Math.round(current.main.feels_like)}°C
          </div>
        </div>

        <img
          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
          className="w-24 sm:w-32 drop-shadow-md"
        />
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { label: t("weatherPage.humidity"), value: current.main.humidity + "%", icon: "💧" },
          { label: t("weatherPage.wind"), value: current.wind.speed + " m/s", icon: "💨" },
          { label: t("weatherPage.pressure"), value: current.main.pressure + " hPa", icon: "⏲️" },
          { label: t("weatherPage.visibility", "Visibility"), value: current.visibility / 1000 + " km", icon: "👁️" },
          { label: t("weatherPage.sunrise"), value: sunrise, icon: "🌅" },
          { label: t("weatherPage.sunset"), value: sunset, icon: "🌇" },
        ].map((m, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">{m.label}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-1 flex items-center justify-center gap-2">
              <span className="text-sm opacity-50">{m.icon}</span> {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* AQI */}
      <AQICard aqi={aqi} />

      {/* HOURLY TEMP GRAPH */}
      <div className="mt-10 mb-6 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <WeatherGraph hourly={hourly} />
      </div>

      {/* NEXT 6 DAYS */}
      <h2 className="text-xl font-bold mb-4 mt-10 text-gray-800 dark:text-white uppercase tracking-wider text-sm pl-2">
        {t("weatherPage.weeklyForecast")}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {forecast.map((d, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center"
          >
            <div className="text-gray-400 text-[10px] font-black uppercase">
              {new Date(d.dt * 1000).toLocaleDateString(i18n.language === "en" ? "en-US" : i18n.language === "hi" ? "hi-IN" : "or-IN", {
                weekday: "short",
              })}
            </div>

            <img
              src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`}
              className="w-12 mx-auto"
            />

            <div className="font-bold text-gray-900 dark:text-white text-lg">
              {Math.round(d.main.temp)}°C
            </div>
          </div>
        ))}
      </div>

      {/* SPRAYING TIME */}
      <h2 className="text-xl font-bold mt-12 mb-4 text-gray-800 dark:text-white uppercase tracking-wider text-sm pl-2">
        {t("weatherPage.sprayingTime", "Spraying Time (Next Few Hours)")}
      </h2>

      <div className="space-y-3 mb-10">
        {hourly.slice(0, 5).map((h, i) => {
          const temp = h.main.temp;

          let status =
            temp >= 18 && temp <= 28
              ? t("weatherPage.spray_optimal", "Optimal")
              : temp <= 32
              ? t("weatherPage.spray_moderate", "Moderate")
              : t("weatherPage.spray_unfavourable", "Unfavourable");

          let color =
            status === t("weatherPage.spray_optimal", "Optimal")
              ? "bg-green-100 border-green-200 text-green-800"
              : status === t("weatherPage.spray_moderate", "Moderate")
              ? "bg-yellow-100 border-yellow-200 text-yellow-800"
              : "bg-red-100 border-red-200 text-red-800";

          return (
            <div
              key={i}
              className={`p-4 rounded-2xl flex justify-between items-center shadow-sm border ${color}`}
            >
              <div className="font-bold text-sm">
                {new Date(h.dt * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="font-black uppercase text-xs tracking-widest">{status}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
