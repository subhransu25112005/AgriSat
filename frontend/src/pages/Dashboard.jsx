import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WeatherCard from "../components/Cards/weathercard";
import WeatherIcon from "../components/icons/WeatherIcon";
import NDVIIcon from "../components/icons/NDVIIcon";
import SatelliteIcon from "../components/icons/SatelliteIcon";
import FarmIcon from "../components/icons/FarmIcon";

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState("Your Field");
  const [selectedCrops, setSelectedCrops] = useState([]);

  const navigate = useNavigate();

  // ---- Fetch weather from your backend ----
  useEffect(() => {
    fetch("http://127.0.0.1:8000/weather/?lat=20.2961&lon=85.8245")
      .then((res) => res.json())
      .then((data) => {
        console.log("Weather:", data);
        if (data && data.current) {
          setWeather(data);
          setLocation("Bhubaneswar"); // later you can make this dynamic
        }
      })
      .catch((e) => console.log("Weather Error:", e));
  }, []);

  // ---- Crop chips at the top ----
  const crops = [
    { name: "Grapes", icon: "/assets/illustrations/grapes.png" },
    { name: "Papaya", icon: "/assets/illustrations/papaya.png" },
    { name: "Olive", icon: "/assets/illustrations/olive.png" },
    { name: "Rose", icon: "/assets/illustrations/rose.png" },
    { name: "Sugarcane", icon: "/assets/illustrations/sugarcane.png" },
    { name: "Add", icon: "add" }
  ];

  // Common glow style for cards
  const glowCard =
    "bg-white/90 rounded-xl shadow-md p-4 border border-transparent " +
    "hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.7)] " +
    "transition-all duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white">
      <div className="max-w-md mx-auto p-4 space-y-6 pb-16">
        {/* DASHBOARD HEADER (ONLY LOGO) */}
        <div className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="max-w-md mx-auto flex items-center justify-center px-4 py-3">
            <img
              src="/public/logo.png"
              alt="AgriSat Logo"
              className="h-12 object-contain"
            />
          </div>
        </div>
        {/* CROP SCROLL WITH SELECT / DESELECT */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {crops.map((crop) => {
            const isSelected = selectedCrops.includes(crop.name);

            return (
              <button
                key={crop.name}
                onClick={() => {
                  if (crop.name === "Add") {
                    navigate("/select-crops");
                    return;
                  }

                  setSelectedCrops((prev) =>
                    prev.includes(crop.name)
                      ? prev.filter((c) => c !== crop.name) // deselect
                      : [...prev, crop.name] // select
                  );
                }}
                className="relative flex-shrink-0 focus:outline-none group"
                type="button"
              >
                {/* Blue X when selected */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                    ×
                  </div>
                )}

                <div
                  className={`rounded-2xl shadow-md border transition ${isSelected ? "border-blue-500 shadow-blue-300" : "border-slate-100"
                    }`}
                >
                  {crop.icon === "add" ? (
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <span className="text-5xl font-bold text-blue-600 leading-none">+</span>
                    </div>
                  ) : (
                    <img
                      src={crop.icon}
                      alt={crop.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  )}
                </div>

                <p className="mt-1 text-xs text-center text-gray-700">{crop.name}</p>
              </button>
            );
          })}
        </div>


        {/* Weather summary card (top, already working) */}
        <WeatherCard location={location} weather={weather} />

        {/* HEAL YOUR CROP */}
        <div className={glowCard}>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Heal your crop
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl">📷</span>
              <p className="text-sm">Take a picture</p>
            </div>

            <span className="text-2xl text-gray-400">›</span>

            <div className="flex flex-col items-center text-center">
              <span className="text-3xl">📄</span>
              <p className="text-sm">See diagnosis</p>
            </div>

            <span className="text-2xl text-gray-400">›</span>

            <div className="flex flex-col items-center text-center">
              <span className="text-3xl">💊</span>
              <p className="text-sm">Get medicine</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/diagnosis")}
            className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 active:scale-[0.98] transition-all"
            type="button"
          >
            Take a picture
          </button>
        </div>

        {/* Precision Farming */}
        <div className={glowCard}>
          <h3 className="text-lg font-semibold text-gray-800">
            Start precision farming
          </h3>

          <p className="text-gray-600 text-sm mt-1">
            Add your field to receive tailored insights & NDVI crop health.
          </p>

          <Link to="/add-field">
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium shadow hover:bg-blue-700 active:scale-[0.98] transition"
              type="button"
            >
              + Add field
            </button>
          </Link>
        </div>

        {/* MAIN TOOLS GRID (Weather, NDVI, Farm insights, Your fields) */}
        <div className={glowCard}>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/weather"
              className="flex flex-col items-center justify-center py-4 rounded-xl bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-md border border-transparent hover:border-emerald-400 transition-all"
            >
              <WeatherIcon size={32} />
              <p className="mt-2 text-sm font-medium">Weather</p>
            </Link>

            <Link
              to="/ndvi"
              onClick={() => navigate("/ndvi-map")}
              className="flex flex-col items-center justify-center py-4 rounded-xl bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-md border border-transparent hover:border-emerald-400 transition-all"
            >
              <NDVIIcon size={32} />
              <p className="mt-2 text-sm font-medium">NDVI Map</p>
            </Link>

            <Link
              to="/farm-insights"
              className="flex flex-col items-center justify-center py-4 rounded-xl bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-md border border-transparent hover:border-emerald-400 transition-all"
            >
              <SatelliteIcon size={32} />
              <p className="mt-2 text-sm font-medium">Farm Insights</p>
            </Link>

            <Link
              to="/profile"
              className="flex flex-col items-center justify-center py-4 rounded-xl bg-slate-50 hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-md border border-transparent hover:border-emerald-400 transition-all"
            >
              <FarmIcon size={32} />
              <p className="mt-2 text-sm font-medium">Your fields</p>
            </Link>
          </div>
        </div>

        {/* EXTRA FEATURE CARDS (like Plantix section – 4 cards) */}
        <div className={glowCard}>
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Smart farming tools
          </h3>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* 1. Fertilizer calculator */}
            <button
              type="button"
              onClick={() => navigate("/fertilizer")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1"></span>

              <span className="font-semibold text-slate-800">
                Fertilizer calculator
              </span>

              <span className="text-xs text-slate-600 mt-1">
                Get dose per acre
              </span>
            </button>

            {/* 2. Pests & diseases guide */}
            <button
              type="button"
              onClick={() => navigate("pests")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">🪲</span>
              <span className="font-semibold text-slate-800">
                Pests &amp; diseases
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Identify &amp; prevent
              </span>
            </button>

            {/* 3. Cultivation tips */}
            <button
              type="button"
              onClick={() => navigate("/cultivation-tips")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">🌱</span>
              <span className="font-semibold text-slate-800">
                Cultivation tips
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Best practices
              </span>
            </button>

            {/* 4. Pest & disease alerts */}
            {/* 4. Pest alerts */}
            <button
              type="button"
              onClick={() => navigate("/pest-alerts")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">⚠️</span>
              <span className="font-semibold text-slate-800">Pest alerts</span>
              <span className="text-xs text-slate-600 mt-1">Stay notified</span>
            </button>

          </div>
        </div>

        {/* SECOND ROW OF FEATURE CARDS (to reach 8–9 total) */}
        <div className={glowCard}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* 5. Market prices */}
            <button
              type="button"
              onClick={() => navigate("/market-prices")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">💹</span>
              <span className="font-semibold text-slate-800">
                Market prices
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Check mandi rates
              </span>
            </button>

            {/* 6. Govt schemes */}
            <button
              type="button"
              onClick={() => navigate("/govt-schemes")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">📜</span>
              <span className="font-semibold text-slate-800">
                Govt schemes
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Know your benefits
              </span>
            </button>

            {/* 7. Knowledge hub */}
            <button
              type="button"
              onClick={() => navigate("/knowledge-hub")}
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">📚</span>
              <span className="font-semibold text-slate-800">
                Knowledge hub
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Guides &amp; videos
              </span>
            </button>

            {/* 8. Expert help */}
            <button
              type="button"
              className="flex flex-col items-start justify-between px-3 py-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-transparent hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-xl mb-1">👨‍🌾</span>
              <span className="font-semibold text-slate-800">
                Ask an expert
              </span>
              <span className="text-xs text-slate-600 mt-1">
                Talk to agronomist
              </span>
            </button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}